// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { convertValue as convertListValue } from '../../converters/clientToList';
import { dataElementTypes } from '../../metaData';
import { actionTypes, batchActionTypes, startAddNoteForEvent } from './WidgetEventNote.actions';

import {
    addEventNote,
    removeEventNote,
} from '../Pages/ViewEvent/ViewEventComponent/editEvent.actions';

import {
    addNote,
    removeNote,
} from '../DataEntry/actions/dataEntry.actions';

export const addNoteForEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_EVENT),
        switchMap((action) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.dataEntries[payload.dataEntryId].eventId;
            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName, surname, userName',
                },
            }).then((user) => {
                const { firstName, surname, userName } = user;
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
                    storedAt: moment().toISOString(),
                };
                const formNote = {
                    ...clientNote,
                    storedAt: convertListValue(clientNote.storedAt, dataElementTypes.DATETIME),
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
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
                ], batchActionTypes.ADD_NOTE_BATCH_FOR_EVENT);
            });
        }));

export const removeNoteForEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.ADD_NOTE_FAILED_FOR_EVENT),
        map((action) => {
            const context = action.meta.context;
            return batchActions([
                removeNote(context.dataEntryId, context.itemId, context.noteClientId),
                removeEventNote(context.eventId, context.noteClientId),
            ], batchActionTypes.REMOVE_NOTE_BATCH_FOR_EVENT);
        }));
