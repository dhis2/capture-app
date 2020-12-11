// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getCurrentUser } from 'capture-core/d2/d2Instance';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'capture-core-utils/moment/momentResolver';
import { convertValue as convertListValue } from '../../../../converters/clientToList';
import { dataElementTypes } from '../../../../metaData';
import {
  actionTypes as viewEventNotesActionTypes,
  batchActionTypes as viewEventNotesBatchActionTypes,
  startSaveEventNote,
  eventNotesLoaded,
} from './viewEventNotes.actions';
import { actionTypes as viewEventActionTypes } from '../ViewEventComponent/viewEvent.actions';
import { addNote, removeNote, setNotes } from '../../../Notes/notes.actions';

const noteKey = 'viewEvent';

export const loadNotesForViewEventEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(
      viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
      viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
      viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
    ),
    map((action) => {
      const { eventContainer } = action.payload;
      const notes = (eventContainer && eventContainer.event && eventContainer.event.notes) || [];
      const convertedNotes = notes.map((note) => ({
        ...note,
        storedDate: convertListValue(note.storedDate, dataElementTypes.DATETIME),
      }));
      // Load event relationships

      return batchActions(
        [eventNotesLoaded(), setNotes(noteKey, convertedNotes)],
        viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH,
      );
    }),
  );

export const addNoteForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(viewEventNotesActionTypes.REQUEST_SAVE_EVENT_NOTE),
    map((action) => {
      const state = store.value;
      const { payload } = action;

      const { eventId } = state.viewEventPage;
      // $FlowFixMe[prop-missing] automated comment
      const userName = getCurrentUser().username;

      const serverData = {
        event: eventId,
        notes: [{ value: payload.note }],
      };

      const clientNote = {
        value: payload.note,
        storedBy: userName,
        storedDate: convertListValue(moment().toISOString(), dataElementTypes.DATETIME),
        clientId: uuid(),
      };
      return batchActions(
        [
          startSaveEventNote(eventId, serverData, state.currentSelections, clientNote.clientId),
          // $FlowFixMe[incompatible-call] automated comment
          addNote(noteKey, clientNote),
        ],
        viewEventNotesBatchActionTypes.SAVE_EVENT_NOTE_BATCH,
      );
    }),
  );

export const saveNoteForViewEventFailedEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(viewEventNotesActionTypes.SAVE_EVENT_NOTE_FAILED),
    map((action) => removeNote(noteKey, action.meta.clientId)),
  );
