// @flow
import 'rxjs/add/observable/of';
import { batchActions } from 'redux-batched-actions';
import { actionTypes as selectorActionTypes } from '../../../MainPage/tempSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    openNewEventInDataEntry,
} from '../newEventDataEntry.actions';
import {
    getRulesActionsOnUpdateForSingleNewEvent,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

import type { FieldData } from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

const UPDATE_FIELD_ACTIONS_BATCH = 'UpdateFieldActionsBatch';

export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(selectorActionTypes.OPEN_NEW_EVENT_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnit = state.currentSelections.orgUnit;
            return openNewEventInDataEntry(programId, orgUnit);
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

            return batchActions(rulesActions, 'RulesEffectsActionsBatch');
        });
