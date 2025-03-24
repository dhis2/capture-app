// @flow
import { v4 as uuid } from 'uuid';
import { batchActions } from 'redux-batched-actions';
import type {
    Enrollment,
    TEIValues,
    OrgUnit,
} from '../../../../rules/RuleEngine/types/ruleEngine.types';
import {
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
    validateAssignEffects,
} from '../../../../rules';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import { TrackerProgram, RenderFoundation, ProgramStage } from '../../../../metaData';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { startRunRulesOnUpdateForNewEnrollment } from './enrollment.actions';
import type { QuerySingleResource } from '../../../../utils/api';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
    UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateDataEntryFieldNewEnrollmentActionBatch',
};

export const runRulesOnUpdateFieldBatch = async ({
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
    querySingleResource,
    onGetValidationContext,
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
    stage: ProgramStage,
    formFoundation?: RenderFoundation,
    currentEvent?: {[id: string]: any},
    querySingleResource: QuerySingleResource,
    onGetValidationContext: () => Object,
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

    const effectsWithValidations = await validateAssignEffects({
        dataElements: formFoundation ? formFoundation.getElements() : program.attributes,
        effects,
        querySingleResource,
        onGetValidationContext,
    });

    return batchActions([
        updateRulesEffects(effectsWithValidations, formId),
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
    onGetValidationContext: () => Object,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions(
        [
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewEnrollment({
                payload: innerAction.payload,
                uid,
                programId,
                orgUnit,
                stage,
                formFoundation,
                onGetValidationContext,
            }),
        ],
        batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH,
    );
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
    onGetValidationContext: () => Object,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions(
        [
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewEnrollment({
                payload: innerAction.payload,
                uid,
                programId,
                orgUnit,
                stage,
                formFoundation,
                onGetValidationContext,
            }),
        ],
        batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH,
    );
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    dataEntryId: string,
    itemId: string,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
    formFoundation: RenderFoundation,
    onGetValidationContext: () => Object,
) => {
    const uid = uuid();

    return batchActions(
        [
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewEnrollment({
                payload: { ...innerAction.payload, dataEntryId, itemId },
                uid,
                programId,
                orgUnit,
                stage,
                formFoundation,
                onGetValidationContext,
            }),
        ],
        batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH,
    );
};
