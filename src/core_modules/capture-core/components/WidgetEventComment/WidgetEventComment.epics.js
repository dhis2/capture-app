// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import { moment } from 'capture-core-utils/moment/momentResolver';
import { convertValue as convertListValue } from '../../converters/clientToList';
import { dataElementTypes } from '../../metaData';
import { actionTypes, batchActionTypes, startAddNoteForEvent } from './WidgetEventComment.actions';

import {
    addEventNote,
    removeEventNote,
} from '../Pages/ViewEvent/ViewEventComponent/editEvent.actions';

import {
    addNote,
    removeNote,
} from '../DataEntry/actions/dataEntry.actions';
import { getCurrentUser } from '../../d2/d2Instance';

export const addNoteForEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.dataEntries[payload.dataEntryId].eventId;
            // $FlowFixMe[prop-missing] automated comment
            const { firstName, surname, userName } = getCurrentUser();
            const clientId = uuid();

            const serverData = {
                event: eventId,
                notes: [{ value: payload.note }],
            };

            const clientNote = {
                value: payload.note,
                lastUpdatedBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                lastUpdated: moment().toISOString(),
                storedBy: userName,
                storedDate: moment().toISOString(),
            };
            const formNote = {
                ...clientNote,
                storedDate: convertListValue(clientNote.storedDate, dataElementTypes.DATETIME),
            };
            const saveContext = {
                dataEntryId: payload.dataEntryId,
                itemId: payload.itemId,
                eventId,
                noteClientId: clientId,
            };

            return batchActions([
                startAddNoteForEvent(eventId, serverData, state.currentSelections, saveContext),
                addNote(payload.dataEntryId, payload.itemId, formNote),
                addEventNote(eventId, clientNote),
            ], batchActionTypes.ADD_NOTE_BATCH);
        }));

export const removeNoteForEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.ADD_NOTE_FAILED),
        map((action) => {
            const context = action.meta.context;
            return batchActions([
                removeNote(context.dataEntryId, context.itemId, context.noteClientId),
                removeEventNote(context.eventId, context.noteClientId),
            ], batchActionTypes.REMOVE_NOTE_BATCH);
        }));
