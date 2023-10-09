// @flow
import { v4 as uuid } from 'uuid';
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
    OrgUnit,
} from '@dhis2/rules-engine-javascript';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../rules';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import { TrackerProgram, RenderFoundation, ProgramStage } from '../../../../metaData';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { startRunRulesOnUpdateForNewEnrollment } from './enrollment.actions';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
    UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateDataEntryFieldNewEnrollmentActionBatch',
};

export const runRulesOnUpdateFieldBatch = ({
    program,
    formId,
    dataEntryId,
    itemId,
    orgUnit,
    enrollmentData,
    attributeValues,
    extraActions = [],
    uid,
    stage,
    formFoundation,
    currentEvent,
}: {
    program: TrackerProgram,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: OrgUnit,
    enrollmentData?: Enrollment,
    attributeValues?: TEIValues,
    extraActions: Array<ReduxAction<any, any>>,
    uid: string,
    stage?: ProgramStage,
    formFoundation?: RenderFoundation,
    currentEvent?: {[id: string]: any},
}) => {
    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit,
        currentEvent,
        enrollmentData,
        attributeValues,
        formFoundation,
    });
    return batchActions([
        updateRulesEffects(effects, formId),
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
        ...extraActions,
    ], batchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT);
};

export const updateDataEntryFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit, stage, formFoundation),
    ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit, stage, formFoundation),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    dataEntryId: string,
    itemId: string,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
) => {
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        startRunRulesOnUpdateForNewEnrollment({ ...innerAction.payload, dataEntryId, itemId }, uid, programId, orgUnit, stage, formFoundation),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};
