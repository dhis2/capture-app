// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { convertValue as convertListValue } from '../../../../converters/clientToList';
import { dataElementTypes } from '../../../../metaData';
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
            const convertedNotes = notes.map(note => ({
                ...note,
                storedDate: convertListValue(note.storedAt, dataElementTypes.DATETIME),
            }));
            // Load event relationships

            return batchActions([
                eventNotesLoaded(),
                setNotes(noteKey, convertedNotes),
            ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH);
        }));

export const addNoteForViewEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE),
        switchMap((action) => {
            const state = store.value;
            const payload = action.payload;

            const eventId = state.viewEventPage.eventId;
            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'userName,firstName,surname',
                },
            }).then((user) => {
                const { userName, firstName, surname } = user;
                const clientId = uuid();
                const serverData = {
                    event: eventId,
                    notes: [{ value: payload.note }],
                };

                const clientNote = {
                    value: payload.note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedDate: convertListValue(moment().toISOString(), dataElementTypes.DATETIME),
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
