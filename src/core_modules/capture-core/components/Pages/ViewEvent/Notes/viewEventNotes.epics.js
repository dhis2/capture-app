// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getCurrentUser } from 'capture-core/d2/d2Instance';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { convertValue as convertListValue } from '../../../../converters/clientToList';
import { dataElementTypes, getEventProgramThrowIfNotFound } from '../../../../metaData';
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
import { convertValue as convertToServerValue } from '../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../events/mainConverters';


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
                storedAt: convertListValue(note.storedAt, dataElementTypes.DATETIME),
            }));
            // Load event relationships

            return batchActions([
                eventNotesLoaded(),
                setNotes(noteKey, convertedNotes),
            ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH);
        }));

export const addNoteForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.viewEventPage.eventId;
            const eventContainer = state.viewEventPage.loadedValues.eventContainer;
            const { event: clientMainValues, values: clientValues } = eventContainer;
            const program = getEventProgramThrowIfNotFound(clientMainValues.programId);
            const formFoundation = program.stage.stageForm;
            const formServerValues = formFoundation.convertValues(clientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(clientMainValues);

            // $FlowFixMe[prop-missing] automated comment
            const userName = getCurrentUser().username;

            const serverData = {
                events: [{
                    ...mainDataServerValues,
                    notes: [{ value: payload.note }, ...mainDataServerValues.notes],
                    dataValues: Object
                        .keys(formServerValues)
                        .map(key => ({
                            dataElement: key,
                            value: formServerValues[key],
                        })),
                }],
            };

            const clientNote = {
                value: payload.note,
                storedBy: userName,
                storedAt: convertListValue(moment().toISOString(), dataElementTypes.DATETIME),
                clientId: uuid(),
            };
            return batchActions([
                startSaveEventNote(eventId, serverData, state.currentSelections, clientNote.clientId),
                // $FlowFixMe[incompatible-call] automated comment
                addNote(noteKey, clientNote),
            ], viewEventNotesBatchActionTypes.SAVE_EVENT_NOTE_BATCH);
        }));

export const saveNoteForViewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(viewEventNotesActionTypes.SAVE_EVENT_NOTE_FAILED),
        map(action => removeNote(noteKey, action.meta.clientId)));
