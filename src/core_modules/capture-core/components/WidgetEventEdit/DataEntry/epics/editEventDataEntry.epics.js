// @flow
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import {
    batchActionTypes as editEventDataEntryBatchActionTypes,
    actionTypes as editEventDataEntryActionTypes,
} from '../editEventDataEntry.actions';
import { getProgramThrowIfNotFound } from '../../../../metaData';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForEventProgram,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
    type FieldData,
} from '../../../../rules';
import { getStageFromEvent } from '../../../../metaData/helpers/getStageFromEvent';
import { EventProgram, TrackerProgram } from '../../../../metaData/Program';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { prepareEnrollmentEventsForRulesEngine } from '../../../../events/prepareEnrollmentEvents';
import { getEnrollmentForRulesEngine, getAttributeValuesForRulesEngine } from '../../helpers';

const runRulesForEditSingleEvent = ({
    store,
    dataEntryId,
    itemId,
    uid,
    orgUnit,
    fieldData,
    programId,
}: {
    store: ReduxStore,
    dataEntryId: string,
    itemId: string,
    uid: string,
    programId: string,
    orgUnit: OrgUnit,
    fieldData?: ?FieldData,
}) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const eventId = state.dataEntries[dataEntryId].eventId;
    const event = state.events[eventId];
    const program = getProgramThrowIfNotFound(programId);

    const stage = program instanceof EventProgram
        ? program.stage
        : getStageFromEvent(event)?.stage;

    if (!stage) {
        throw Error(i18n.t('stage not found in rules execution'));
    }

    const foundation = stage.stageForm;
    const currentEventValues = foundation ? getCurrentClientValues(state, foundation, formId, fieldData) : {};
    const currentEventMainData = foundation ? getCurrentClientMainData(state, itemId, dataEntryId, foundation) : {};
    // $FlowFixMe
    const currentEvent = { ...currentEventValues, ...currentEventMainData, eventId };

    let effects;
    if (program instanceof TrackerProgram) {
        const { enrollment, attributeValues } = state.enrollmentDomain;

        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage,
            orgUnit,
            currentEvent,
            otherEvents: prepareEnrollmentEventsForRulesEngine(
                enrollment?.events.filter(enrollmentEvent => enrollmentEvent.event !== currentEvent.eventId),
            ),
            enrollmentData: getEnrollmentForRulesEngine(enrollment),
            attributeValues: getAttributeValuesForRulesEngine(attributeValues, program.attributes),
        });
    } else {
        effects = getApplicableRuleEffectsForEventProgram({
            program,
            orgUnit,
            currentEvent,
        });
    }

    return batchActions([
        updateRulesEffects(effects, formId),
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    editEventDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH);
};

export const runRulesOnUpdateDataEntryFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE),
        ),
        map((action) => {
            const { dataEntryId, itemId, uid, orgUnit, programId } = action.payload;
            return runRulesForEditSingleEvent({ store, dataEntryId, itemId, uid, orgUnit, programId });
        }));

export const runRulesOnUpdateFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE),
        ),
        map((action) => {
            const {
                elementId,
                value,
                uiState,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                programId,
            } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForEditSingleEvent({
                store,
                dataEntryId,
                itemId,
                uid,
                orgUnit,
                fieldData,
                programId,
            });
        }));

