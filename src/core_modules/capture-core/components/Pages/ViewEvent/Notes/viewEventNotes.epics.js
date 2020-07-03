// @flow
import { batchActions } from 'redux-batched-actions';
import { getCurrentUser } from 'capture-core/d2/d2Instance';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'capture-core-utils/moment/momentResolver';
import { convertValue as convertListValue } from '../../../../converters/clientToList';
import elementTypes from '../../../../metaData/DataElement/elementTypes';
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

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(
        viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
        viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
        viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
    )
        .map((action) => {
            const eventContainer = action.payload.eventContainer;
            const notes = (eventContainer && eventContainer.event && eventContainer.event.notes) || [];
            const convertedNotes = notes.map(note => ({
                ...note,
                // $FlowFixMe[prop-missing] automated comment
                storedDate: convertListValue(note.storedDate, elementTypes.DATETIME),
            }));
            // Load event relationships

            return batchActions([
                eventNotesLoaded(),
                setNotes(noteKey, convertedNotes),
            ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH);
        });

export const addNoteForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;

            const eventId = state.viewEventPage.eventId;
            // $FlowFixMe[prop-missing] automated comment
            const userName = getCurrentUser().username;

            const serverData = {
                event: eventId,
                notes: [{ value: payload.note }],
            };

            const clientNote = {
                value: payload.note,
                storedBy: userName,
                // $FlowFixMe[prop-missing] automated comment
                storedDate: convertListValue(moment().toISOString(), elementTypes.DATETIME),
                clientId: uuid(),
            };
            return batchActions([
                startSaveEventNote(eventId, serverData, state.currentSelections, clientNote.clientId),
                // $FlowFixMe[incompatible-call] automated comment
                addNote(noteKey, clientNote),
            ], viewEventNotesBatchActionTypes.SAVE_EVENT_NOTE_BATCH);
        });

export const saveNoteForViewEventFailedEpic = (action$: InputObservable) =>

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(viewEventNotesActionTypes.SAVE_EVENT_NOTE_FAILED)
        .map(action => removeNote(noteKey, action.meta.clientId));
