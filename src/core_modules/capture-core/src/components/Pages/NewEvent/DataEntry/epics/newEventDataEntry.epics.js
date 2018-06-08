// @flow
import 'rxjs/add/observable/of';
import { batchActions } from 'redux-batched-actions';
import { actionTypes as selectorActionTypes } from '../../../MainPage/tempSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    openNewEventInDataEntry,
    selectionsNotCompleteOpeningNewEvent,
} from '../newEventDataEntry.actions';
import {
    getRulesActionsOnUpdateForSingleNewEvent,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import {
    actionTypes as newEventSelectionTypes,
} from '../../newEventSelections.actions';


import type { FieldData } from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

const UPDATE_FIELD_ACTIONS_BATCH = 'UpdateFieldActionsBatch';

export const batchActionTypes = {
    OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenNewEventInDataEntryActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsActionsBatch',
};

export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(selectorActionTypes.OPEN_NEW_EVENT_PAGE, newEventSelectionTypes.VALID_SELECTIONS_FROM_URL)
        .map(() => {
            const state = store.getState();
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return selectionsNotCompleteOpeningNewEvent();
            }
            const programId = state.currentSelections.programId;
            const orgUnit = state.currentSelections.orgUnit;
            return batchActions(openNewEventInDataEntry(programId, orgUnit), batchActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH);
        });

export const runRulesForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(UPDATE_FIELD_ACTIONS_BATCH)
        .map(actionBatch => actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnit = state.currentSelections.orgUnit;

            const payload = action.payload;
            const fieldData: FieldData = {
                elementId: payload.elementId,
                value: payload.value,
                valid: payload.uiState.valid,
            };

            const rulesActions = getRulesActionsOnUpdateForSingleNewEvent(
                programId,
                payload.formId,
                payload.itemId,
                payload.dataEntryId,
                state,
                orgUnit,
                fieldData,
            );

            return batchActions(rulesActions, batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH);
        });
