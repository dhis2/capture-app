// @flow
import 'rxjs/add/observable/of';
import { actionTypes as selectorActionTypes } from '../../MainPage/tempSelector.actions';
import { actionTypes as newEventDataEntryActionTypes } from './newEventDataEntry.actions';
import { openNewEventInDataEntry } from '../../../DataEntry/actions/dataEntryLoad.actions';
import { getRulesActionsOnUpdateForSingleNewEvent } from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

import type { FieldData } from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(selectorActionTypes.OPEN_NEW_EVENT_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnit = state.currentSelections.orgUnit;
            return openNewEventInDataEntry(null, 'main', programId, orgUnit);
        });

export const runRulesForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_RUN_RULES)
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

            return getRulesActionsOnUpdateForSingleNewEvent(
                programId,
                payload.formId,
                payload.eventId,
                payload.dataEntryId,
                state,
                orgUnit,
                fieldData,
            );
        });
