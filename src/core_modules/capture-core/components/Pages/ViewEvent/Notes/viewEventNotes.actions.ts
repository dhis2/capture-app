import { featureAvailable, FEATURES } from 'capture-core-utils';
import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';

export const batchActionTypes = {
    LOAD_EVENT_NOTES_BATCH: 'LoadEventNotesBatch',
    SAVE_EVENT_NOTE_BATCH: 'SaveEventNoteBatch',
};

export const actionTypes = {
    EVENT_NOTES_LOADED: 'EventNotesLoaded',
    REQUEST_SAVE_EVENT_NOTE: 'RequestSaveEventNote',
    START_SAVE_EVENT_NOTE: 'StartSaveEventNote',
    SAVE_EVENT_NOTE_FAILED: 'SaveEventNoteFailed',
    EVENT_NOTE_SAVED: 'EventNoteSaved',
    UPDATE_EVENT_NOTE_FIELD: 'UpdateEventNoteField',
};

export const eventNotesLoaded = () =>
    actionCreator(actionTypes.EVENT_NOTES_LOADED)();

export const updateEventNoteField = (value: string) =>
    actionCreator(actionTypes.UPDATE_EVENT_NOTE_FIELD)({ value });

export const requestSaveEventNote = (note: string) =>
    actionCreator(actionTypes.REQUEST_SAVE_EVENT_NOTE)({ note });

export const startSaveEventNote = (eventUid: string, serverData: any, selections: any, clientId: string) =>
    actionCreator(actionTypes.START_SAVE_EVENT_NOTE)({ selections, clientId }, {
        offline: {
            effect: {
                url: (featureAvailable(FEATURES.newNoteEndpoint))
                    ? `tracker/events/${eventUid}/note`
                    : `events/${eventUid}/note`,
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.EVENT_NOTE_SAVED, meta: { selections, clientId } },
            rollback: { type: actionTypes.SAVE_EVENT_NOTE_FAILED, meta: { selections, clientId } },
        },
    });
