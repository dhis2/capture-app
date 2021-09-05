// @flow
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const actionTypes = {
    REQUEST_ADD_NOTE: 'RequestAddNote',
    START_ADD_NOTE: 'StartAddNote',
    NOTE_ADDED: 'NoteAdded',
    ADD_NOTE_FAILED: 'AddNoteFailed',
};

export const batchActionTypes = {
    ADD_NOTE_BATCH: 'AddNoteBatch',
    REMOVE_NOTE_BATCH: 'RemoveNoteBatch',
};

export const requestAddNoteForEvent = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(actionTypes.REQUEST_ADD_NOTE)({ itemId, dataEntryId, note });

export const startAddNoteForEvent = (eventId: string, serverData: Object, selections: Object, context: Object) =>
    actionCreator(actionTypes.START_ADD_NOTE)({ selections, context }, {
        offline: {
            effect: {
                url: `events/${eventId}/note`,
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.NOTE_ADDED, meta: { selections, context } },
            rollback: { type: actionTypes.ADD_NOTE_FAILED, meta: { selections, context } },
        },
    });
