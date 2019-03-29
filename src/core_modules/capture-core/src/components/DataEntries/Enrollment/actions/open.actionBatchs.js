// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { batchActions } from 'redux-batched-actions';
import { getApi } from '../../../../d2/d2Instance';
import {
    getRulesActionsForTEI,
} from '../../../../rulesEngineActionsCreator';
import { RenderFoundation, TrackerProgram } from '../../../../metaData';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from './open.actions';
import { getEnrollmentDateValidatorContainer, getIncidentDateValidatorContainer } from '../fieldValidators';
import { convertGeometryOut } from '../../converters';

const itemId = 'newEnrollment';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'enrollmentDate',
        type: 'DATE',
        validatorContainers: getEnrollmentDateValidatorContainer(),
    },
    {
        id: 'incidentDate',
        type: 'DATE',
        validatorContainers: getIncidentDateValidatorContainer(),
    },
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
];

export const batchActionTypes = {
    OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH: 'OpenDataEntryForNewEnrollmentBatch',
};

type StaticPatternValues = {
    orgUnitCode: string,
};

async function generateUniqueValueAsync(
    teaId: string,
    staticPatternValues: StaticPatternValues,
) {
    const api = getApi();
    const requiredValues = await api
        .get(`trackedEntityAttributes/${teaId}/requiredValues`)
        .then(response => response && response.REQUIRED)
        .catch((error) => {
            log.error(
                errorCreator('Could not retrieve required values')({ teaId, error }),
            );
            return null;
        });

    const orgUnitCodeQueryParameter = requiredValues && requiredValues.includes('ORG_UNIT_CODE') ? {
        ORG_UNIT_CODE: staticPatternValues.orgUnitCode,
    } : null;

    const generatedValue = await api
        .get(`trackedEntityAttributes/${teaId}/generate`, orgUnitCodeQueryParameter)
        .then(response => response && response.value)
        .catch((error) => {
            log.error(
                errorCreator('Could not generate unique id')({ teaId, error }),
            );
            return null;
        });

    return generatedValue;
}

function getGeneratedUniqueValuesAsync(
    foundation: ?RenderFoundation,
    generatedUniqueValuesCache: ?Object,
    staticPatternValues: StaticPatternValues,
) {
    if (!foundation) {
        return {};
    }

    const valueContainerPromises = foundation
        .getElements()
        .filter(dataElement => dataElement.unique && dataElement.unique.generatable)
        .map(async (dataElement) => {
            const id = dataElement.id;
            if (generatedUniqueValuesCache && generatedUniqueValuesCache[id]) {
                return {
                    id,
                    value: generatedUniqueValuesCache[id],
                };
            }
            return generateUniqueValueAsync(id, staticPatternValues)
                .then(value => ({
                    id,
                    value,
                }));
        });

    return Promise
        .all(valueContainerPromises)
        .then(valueContainers => valueContainers.reduce((accValues, container) => {
            accValues[container.id] = container.value;
            return accValues;
        }, {}));
}

export const openDataEntryForNewEnrollmentBatchAsync = async (
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    extraActions: Array<ReduxAction<any, any>> = [],
    extraDataEntryProps: Array<Object> = [],
    generatedUniqueValuesCache: ?Object,
) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const generatedValues = await
        getGeneratedUniqueValuesAsync(foundation, generatedUniqueValuesCache, { orgUnitCode: orgUnit.code });
    const dataEntryActions =
            loadNewDataEntry(
                dataEntryId,
                itemId,
                [...dataEntryPropsToInclude, ...extraDataEntryProps],
                null,
                generatedValues,
            );

    let rulesActions;
    if (program && foundation) {
        rulesActions = getRulesActionsForTEI(
            program,
            foundation,
            formId,
            orgUnit,
        );
    } else {
        rulesActions = [];
    }

    return batchActions([
        openDataEntryForNewEnrollment(dataEntryId, generatedValues),
        ...dataEntryActions,
        ...rulesActions,
        ...extraActions,
    ], batchActionTypes.OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH);
};
