// @flow
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import {
    newEventWidgetActionTypes,
    saveEvent,
    saveEventCallbackAction,
} from './validated.actions';

import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';

export const saveNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventWidgetActionTypes.EVENT_SAVE_REQUEST),
        mergeMap((action) => {
            const state = store.value;
            const { formFoundation, dataEntryId, eventId, completed, onSaveActionType } = action.payload;
            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);
            const { formClientValues, mainDataClientValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getAddEventEnrollmentServerData(state, formFoundation, formClientValues, mainDataClientValues, completed);
            const relationshipData = state.dataEntriesRelationships[dataEntryKey];

            const saveEventAction = saveEvent(serverData, relationshipData, state.currentSelections);

            return onSaveActionType ?
                of(saveEventAction, saveEventCallbackAction(onSaveActionType, serverData)) :
                of(saveEventAction);
        }));
