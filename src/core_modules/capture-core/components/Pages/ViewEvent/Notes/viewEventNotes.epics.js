// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { map, switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
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

const createServerData = (eventId, note, useNewEndpoint) => {
    if (useNewEndpoint) {
        return { event: eventId, value: note };
    }
    return { event: eventId, notes: [{ value: note }] };
};

export const loadNotesForViewEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
        ),
        map((action) => {
            const eventContainer = action.payload.eventContainer;
            const notes = (eventContainer && eventContainer.event && eventContainer.event.notes) || [];
            // Load event relationships

            return batchActions([
                eventNotesLoaded(),
                setNotes(noteKey, notes),
            ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH);
        }));

export const addNoteForViewEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE),
        switchMap((action) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.viewEventPage.eventId;
            const useNewEndpoint = featureAvailable(FEATURES.newNoteEndpoint);

            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'userName,firstName,surname',
                },
            }).then((user) => {
                const { userName, firstName, surname } = user;
                const clientId = uuid();
                const serverData = createServerData(eventId, payload.note, useNewEndpoint);

                const clientNote = {
                    value: payload.note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
                    clientId: uuid(),
                };
                return batchActions([
                    startSaveEventNote(eventId, serverData, state.currentSelections, clientNote.clientId),
                    // $FlowFixMe[incompatible-call] automated comment
                    addNote(noteKey, clientNote),
                ], viewEventNotesBatchActionTypes.SAVE_EVENT_NOTE_BATCH);
            });
        }));

export const saveNoteForViewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.SAVE_EVENT_NOTE_FAILED),
        map(action => removeNote(noteKey, action.meta.clientId)));
