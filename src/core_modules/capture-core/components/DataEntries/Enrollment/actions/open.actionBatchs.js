// @flow
import { batchActions } from 'redux-batched-actions';
import {
    getRulesActionsForTEI,
} from '../../../../rules/actionsCreator';
import { RenderFoundation, TrackerProgram } from '../../../../metaData';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from './open.actions';
import { getEnrollmentDateValidatorContainer, getIncidentDateValidatorContainer } from '../fieldValidators';
import { convertGeometryOut } from '../../converters';
import { getGeneratedUniqueValuesAsync } from '../../common/TEIAndEnrollment';

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

export const openDataEntryForNewEnrollmentBatchAsync = async (
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    extraActions: Array<ReduxAction<any, any>> = [],
    extraDataEntryProps: Array<Object> = [],
    generatedUniqueValuesCache: Object = {},
) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const generatedItemContainers = await
        getGeneratedUniqueValuesAsync(foundation, generatedUniqueValuesCache, { orgUnitCode: orgUnit.code });
    const dataEntryActions =
            loadNewDataEntry(
                dataEntryId,
                itemId,
                [...dataEntryPropsToInclude, ...extraDataEntryProps],
                null,
                generatedItemContainers
                    .reduce((accValuesByKey, container) => {
                        accValuesByKey[container.id] = container.item.value;
                        return accValuesByKey;
                    }, {}),
            );

    let rulesActions;
    if (program && foundation) {
        rulesActions = getRulesActionsForTEI(
            program,
            foundation,
            formId,
            orgUnit,
            {},
            {},
        );
    } else {
        rulesActions = [];
    }

    return batchActions([
        openDataEntryForNewEnrollment(
            dataEntryId,
            generatedItemContainers
                .reduce((accItemsByKey, container) => {
                    accItemsByKey[container.id] = container.item;
                    return accItemsByKey;
                }, {}),
        ),
        ...dataEntryActions,
        ...rulesActions,
        ...extraActions,
    ], batchActionTypes.OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH);
};
