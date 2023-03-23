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
import { TrackerProgram, RenderFoundation, Section, ProgramStage } from '../../../../metaData';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { startRunRulesOnUpdateForNewEnrollment } from './enrollment.actions';
import { convertValue } from '../../../../converters/formToClient';

export const batchActionTypes = {
    RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT: 'RulesExecutedPostUpdateFieldForEnrollment',
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
    UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateDataEntryFieldNewEnrollmentActionBatch',
};

export const getCurrentEventValuesFromStage = (attributeValues?: TEIValues, stage: ProgramStage) => {
    const section = stage.stageForm.getSection(Section.MAIN_SECTION_ID);
    const dataElements = [...section.elements.entries()].map(([key, val]) => ({ id: key, type: val.type }));
    const currentEventValues = {};
    if (attributeValues) {
        Object.keys(attributeValues).forEach((attributeId) => {
            const found = dataElements.find(element => element.id === attributeId);
            if (found) {
                currentEventValues[attributeId] = convertValue(attributeValues[attributeId], found.type);
                delete attributeValues[attributeId];
            }
        });
    }

    return { currentEventValues, attributeValues };
};

export const runRulesOnUpdateFieldBatch = (
    program: TrackerProgram,
    foundation: RenderFoundation,
    formId: string,
    dataEntryId: string,
    itemId: string,
    orgUnit: OrgUnit,
    enrollmentData?: Enrollment,
    teiAttributeValues?: TEIValues,
    extraActions: Array<ReduxAction<any, any>> = [],
    uid: string,
    stage?: ProgramStage,
) => {
    let effects;

    if (stage) {
        const { attributeValues, currentEventValues } = getCurrentEventValuesFromStage(teiAttributeValues, stage);
        const currentEvent = { ...currentEventValues, programStageId: stage.id };
        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage,
            orgUnit,
            currentEvent,
            enrollmentData,
            attributeValues,
        });
    } else {
        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage,
            orgUnit,
            enrollmentData,
            attributeValues: teiAttributeValues,
        });
    }
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
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid, stage),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit, stage),
    ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid, stage),
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, uid, programId, orgUnit, stage),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    dataEntryId: string,
    itemId: string,
    programId: string,
    orgUnit: OrgUnit,
    stage?: ProgramStage,
) => {
    const uid = uuid();

    return batchActions([
        innerAction,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid, stage),
        startRunRulesOnUpdateForNewEnrollment({ ...innerAction.payload, dataEntryId, itemId }, uid, programId, orgUnit, stage),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};
