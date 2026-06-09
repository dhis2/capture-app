import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { CurrentUser } from '../../../../utils/userInfo/CurrentUser';
import {
    actionTypes as viewEventNotesActionTypes,
    batchActionTypes as viewEventNotesBatchActionTypes,
    startSaveEventNote,
    eventNotesLoaded,
} from './viewEventNotes.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../ViewEventComponent/viewEvent.actions';
import {
    addNote,
    removeNote,
    setNotes,
} from '../../../Notes/notes.actions';

const noteKey = 'viewEvent';

const createServerData = (eventId: string, note: string, useNewEndpoint: boolean) => {
    if (useNewEndpoint) {
        return { event: eventId, value: note };
    }
    return { event: eventId, notes: [{ value: note }] };
};

export const loadNotesForViewEventEpic = (action$: any) =>
    action$.pipe(
        ofType(
            viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
        ),
        map((action: any) => {
            const eventContainer = action.payload.eventContainer;
            const notes = (eventContainer && eventContainer.event && eventContainer.event.notes) || [];

            return batchActions([
                eventNotesLoaded(),
                setNotes(noteKey, notes),
            ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH);
        }));

export const addNoteForViewEventEpic = (action$: any, store: any, { fromClientDate }: any) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE),
        map((action: any) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.viewEventPage.eventId;
            const useNewEndpoint = featureAvailable(FEATURES.newNoteEndpoint);
            const { firstName, surname, username } = CurrentUser.get();
            const clientId = uuid();
            const serverData = createServerData(eventId, payload.note, useNewEndpoint);

            const clientNote = {
                value: payload.note,
                createdBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                storedBy: username,
                storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                clientId,
            };
            return batchActions([
                startSaveEventNote(eventId, serverData, state.currentSelections, clientNote.clientId),
                addNote(noteKey, clientNote),
            ], viewEventNotesBatchActionTypes.SAVE_EVENT_NOTE_BATCH);
        }));

export const saveNoteForViewEventFailedEpic = (action$: any) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.SAVE_EVENT_NOTE_FAILED),
        map((action: any) => removeNote(noteKey, action.meta.clientId)));
