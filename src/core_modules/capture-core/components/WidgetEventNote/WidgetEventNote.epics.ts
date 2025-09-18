import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { map, switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import type { ReduxStore, ApiUtils, EpicAction } from '../../../capture-core-utils/types';
import { actionTypes, batchActionTypes, startAddNoteForEvent } from './WidgetEventNote.actions';
import type { ClientNote, FormNote, SaveContext } from './WidgetEventNote.types';

import {
    addEventNote,
    removeEventNote,
} from '../Pages/ViewEvent/ViewEventComponent/editEvent.actions';

import {
    addNote,
    removeNote,
} from '../DataEntry/actions/dataEntry.actions';

type AddNoteActionPayload = {
    itemId: string;
    dataEntryId: string;
    note: string;
};

type RemoveNoteActionMeta = {
    context: SaveContext;
};

const createServerData = (eventId: string, note: string, useNewEndpoint: boolean): Record<string, unknown> => {
    if (useNewEndpoint) {
        return { event: eventId, value: note };
    }
    return { event: eventId, notes: [{ value: note }] };
};

export const addNoteForEventEpic = (
    action$: EpicAction<AddNoteActionPayload>,
    store: ReduxStore,
    { querySingleResource, fromClientDate }: ApiUtils
) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_EVENT),
        switchMap((action: { payload: AddNoteActionPayload }) => {
            const state = store.value;
            const payload = action.payload;
            const eventId = state.dataEntries[payload.dataEntryId].eventId;
            const useNewEndpoint = featureAvailable(FEATURES.newNoteEndpoint);
            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName, surname, userName',
                },
            }).then((user) => {
                const { firstName, surname, userName } = user;
                const clientId = uuid();

                const serverData = createServerData(eventId, payload.note, useNewEndpoint);

                const clientNote: ClientNote = {
                    value: payload.note,
                    lastUpdatedBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                };
                const formNote: FormNote = {
                    ...clientNote,
                    storedAt: clientNote.storedAt,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                };
                const saveContext: SaveContext = {
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

export const removeNoteForEventEpic = (action$: EpicAction<any, RemoveNoteActionMeta>) =>
    action$.pipe(
        ofType(actionTypes.ADD_NOTE_FAILED_FOR_EVENT),
        map((action: { meta: { context: SaveContext } }) => {
            const context = action.meta.context;
            return batchActions([
                removeNote(context.dataEntryId, context.itemId, context.noteClientId),
                removeEventNote(context.eventId, context.noteClientId),
            ], batchActionTypes.REMOVE_NOTE_BATCH_FOR_EVENT);
        }));
