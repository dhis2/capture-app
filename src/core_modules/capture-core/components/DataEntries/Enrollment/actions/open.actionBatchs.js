// @flow
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../rules';
import type { TrackerProgram } from '../../../../metaData';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from './open.actions';
import { getEnrollmentDateValidatorContainer, getIncidentDateValidatorContainer } from '../fieldValidators';
import { convertGeometryOut } from '../../converters';
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
    orgUnit,
    dataEntryId,
    extraActions = [],
    extraDataEntryProps = [],
    formValues,
    clientValues,
}: {
    program: TrackerProgram,
    orgUnit: OrgUnit,
    dataEntryId: string,
    extraActions?: Array<ReduxAction<any, any>>,
    extraDataEntryProps?: Array<Object>,
    formValues: { [key: string]: any },
    clientValues: { [key: string]: any },
}) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const dataEntryActions =
            loadNewDataEntry(
                dataEntryId,
                itemId,
                [...dataEntryPropsToInclude, ...extraDataEntryProps],
                { enrolledAt: convertDateObjectToDateFormatString(new Date()) },
            );

    const addFormDataActions = addFormData(`${dataEntryId}-${itemId}`, formValues);

    let effects;
    if (program.useFirstStageDuringRegistration) {
        const firstStage = [...program.stages][0][1];

        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            orgUnit,
            stage: firstStage,
            attributeValues: clientValues,
        });
    } else {
        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            orgUnit,
            attributeValues: clientValues,
        });
    }

    return batchActions([
        openDataEntryForNewEnrollment(
            dataEntryId,
        ),
        ...dataEntryActions,
        addFormDataActions,
        updateRulesEffects(effects, formId),
        ...extraActions,
    ], batchActionTypes.OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT_BATCH);
};
