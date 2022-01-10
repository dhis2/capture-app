// @flow
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../../Pages/ViewEvent/ViewEventComponent/editEvent.actions';
import {
    openEventForEditInDataEntry,
    prerequisitesErrorOpeningEventForEditInDataEntry,
    batchActionTypes as editEventDataEntryBatchActionTypes,
    actionTypes as editEventDataEntryActionTypes,
} from '../editEventDataEntry.actions';
import { getProgramAndStageFromEvent, getProgramThrowIfNotFound } from '../../../../metaData';
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
import { prepareEnrollmentEventsForRulesEngine } from '../../../../events/getEnrollmentEvents';

export const openEditEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            editEventActionTypes.START_OPEN_EVENT_FOR_EDIT,
        ),
        map((action) => {
            const state = store.value;
            const eventContainer = action.payload.eventContainer;
            const orgUnit = action.payload.orgUnit;

            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorOpeningEventForEditInDataEntry(metadataContainer.error);
            }
            const foundation = metadataContainer.stage.stageForm;
            const program = metadataContainer.program;


            return batchActions(openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program, state.enrollmentDomain.enrollment?.events));
        }));

const runRulesForEditSingleEvent = (store: ReduxStore, dataEntryId: string, itemId: string, uid: string, orgUnit: Object, fieldData?: ?FieldData) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const eventId = state.dataEntries[dataEntryId].eventId;
    const event = state.events[eventId];
    const { programId } = state.currentSelections; // TODO: Refactor as part of TECH-599. We should remove currentSelections as part of that task. This component is also being used in edit enrollment event so removing this will also make chagnes necessary for that page.
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
    const currentEvent = { ...currentEventValues, ...currentEventMainData };

    let effects;
    if (program instanceof TrackerProgram) {
        const otherEvents = state.enrollmentDomain.enrollments?.events;
        // TODO: Add attributeValues & enrollmentData
        effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage,
            orgUnit,
            currentEvent,
            otherEvents: otherEvents ? prepareEnrollmentEventsForRulesEngine(otherEvents) : undefined,
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
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { dataEntryId, itemId, uid, orgUnit } = action.payload;
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid, orgUnit);
        }));

export const runRulesOnUpdateFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { elementId, value, uiState, dataEntryId, itemId, uid, orgUnit } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid, orgUnit, fieldData);
        }));

