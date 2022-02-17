// @flow
import { batchActions } from 'redux-batched-actions';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../rules';
import { RenderFoundation, TrackerProgram } from '../../../../metaData';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from './open.actions';
import { getEnrollmentDateValidatorContainer, getIncidentDateValidatorContainer } from '../fieldValidators';
import { convertGeometryOut } from '../../converters';
import { getGeneratedUniqueValuesAsync } from '../../common/TEIAndEnrollment';
import { convertDateObjectToDateFormatString } from '../../../../utils/converters/date';
import { addFormData } from '../../../D2Form/actions/form.actions';

const itemId = 'newEnrollment';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'enrolledAt',
        type: 'DATE',
        // $FlowFixMe[incompatible-call] automated comment
        validatorContainers: getEnrollmentDateValidatorContainer(),
    },
    {
        id: 'occurredAt',
        type: 'DATE',
        // $FlowFixMe[incompatible-call] automated comment
        validatorContainers: getIncidentDateValidatorContainer(),
    },
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
];

export const batchActionTypes = {
    OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT_BATCH: 'OpenDataEntryForNewEnrollmentBatch',
};

export const openDataEntryForNewEnrollmentBatchAsync = async ({
    program,
    foundation,
    orgUnit,
    dataEntryId,
    extraActions = [],
    extraDataEntryProps = [],
    generatedUniqueValuesCache = {},
    formValues,
}: {
    program: TrackerProgram,
    foundation: RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    extraActions?: Array<ReduxAction<any, any>>,
    extraDataEntryProps?: Array<Object>,
    generatedUniqueValuesCache?: ?Object,
    formValues: { [key: string]: any },
}) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const generatedItemContainers = await
    getGeneratedUniqueValuesAsync(foundation, generatedUniqueValuesCache, { orgUnitCode: orgUnit.code });
    const dataEntryActions =
            loadNewDataEntry(
                dataEntryId,
                itemId,
                [...dataEntryPropsToInclude, ...extraDataEntryProps],
                { enrolledAt: convertDateObjectToDateFormatString(new Date()) },
                generatedItemContainers
                    .reduce((accValuesByKey, container) => {
                        accValuesByKey[container.id] = container.item.value;
                        return accValuesByKey;
                    }, {}),
            );

    const addFormDataActions = addFormData(`${dataEntryId}-${itemId}`, formValues);
    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        orgUnit,
    });

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
        addFormDataActions,
        updateRulesEffects(effects, formId),
        ...extraActions,
    ], batchActionTypes.OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT_BATCH);
};
