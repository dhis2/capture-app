// @flow
import { batchActions } from 'redux-batched-actions';
import moment from '../../../../../utils/moment/momentResolver';
import {
    actionTypes as editEventDataEntryActionTypes,
    batchActionTypes as editEventDataEntryBatchActionTypes,
    startAddNoteForEditSingleEvent,
} from '../editEventDataEntry.actions';
import {
    addNote,
} from '../../../../DataEntry/actions/dataEntry.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { getCurrentUser } from '../../../../../d2/d2Instance';

export const addNoteForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventDataEntryActionTypes.REQUEST_ADD_NOTE_FOR_EDIT_SINGLE_EVENT)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
            const eventId = state.dataEntries[payload.dataEntryId].eventId;
            const userName = getCurrentUser().username;

            const serverData = {
                event: eventId,
                notes: [{ value: payload.note }],
            };

            const clientNote = [{ value: payload.note, storedBy: userName, storedDate: moment().toISOString() }];
            return startAddNoteForEditSingleEvent(eventId, serverData, state.currentSelections);
            /*
            return batchActions([
                startAddNoteForEditSingleEvent(eventId, serverData, state.currentSelections),
                addNote(dataEntryKey, clientNote),
            ], editEventDataEntryBatchActionTypes.ADD_NOTE_FOR_EDIT_SINGLE_EVENT_BATCH);
            */
        });
