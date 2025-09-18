import { featureAvailable, FEATURES } from 'capture-core-utils';
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const actionTypes = {
    REQUEST_ADD_NOTE_FOR_EVENT: 'RequestAddNoteForEvent',
    START_ADD_NOTE_FOR_EVENT: 'StartAddNoteForEvent',
    NOTE_ADDED_FOR_EVENT: 'NoteAddedForEvent',
    ADD_NOTE_FAILED_FOR_EVENT: 'AddNoteFailedForEvent',
};

export const batchActionTypes = {
    ADD_NOTE_BATCH_FOR_EVENT: 'AddNoteBatchForEvent',
    REMOVE_NOTE_BATCH_FOR_EVENT: 'RemoveNoteBatchForEvent',
};

export const requestAddNoteForEvent = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(actionTypes.REQUEST_ADD_NOTE_FOR_EVENT)({ itemId, dataEntryId, note });

export const startAddNoteForEvent = (
    eventUid: string, 
    serverData: Record<string, unknown>, 
    selections: Record<string, unknown>, 
    context: Record<string, unknown>
) =>
    actionCreator(actionTypes.START_ADD_NOTE_FOR_EVENT)({ selections, context }, {
        offline: {
            effect: {
                url: (featureAvailable(FEATURES.newNoteEndpoint))
                    ? `tracker/events/${eventUid}/note`
                    : `events/${eventUid}/note`,
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.NOTE_ADDED_FOR_EVENT, meta: { selections, context } },
            rollback: { type: actionTypes.ADD_NOTE_FAILED_FOR_EVENT, meta: { selections, context } },
        },
    });
