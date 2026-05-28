import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import type { ReduxStore, ApiUtils, EpicAction } from 'capture-core-utils/types/global';
import { CurrentUser } from '../../utils/userInfo/CurrentUser';
import { actionTypes, batchActionTypes, startAddNoteForEnrollment, addEnrollmentNote, removeEnrollmentNote }
    from './WidgetEnrollmentNote.actions';
import type { ClientNote, SaveContext } from './WidgetEnrollmentNote.types';

type AddNoteActionPayload = {
    enrollmentId: string;
    note: string;
};

const createServerData = (note: string, useNewEndpoint: boolean): Record<string, unknown> => {
    if (useNewEndpoint) {
        return { value: note };
    }
    return { notes: [{ value: note }] };
};

export const addNoteForEnrollmentEpic = (
    action$: EpicAction<AddNoteActionPayload>,
    store: ReduxStore,
    { fromClientDate }: ApiUtils,
) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_ENROLLMENT),
        map((action: { payload: AddNoteActionPayload }) => {
            const state = store.value;
            const { enrollmentId, note } = action.payload;
            const useNewEndpoint = featureAvailable(FEATURES.newNoteEndpoint);
            const { firstName, surname, username } = CurrentUser.get();
            const clientId = uuid();

            const serverData = createServerData(note, useNewEndpoint);

            const clientNote: ClientNote = {
                value: note,
                createdBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                storedBy: username,
                storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                clientId,
            };

            const saveContext: SaveContext = {
                enrollmentId,
                noteClientId: clientId,
            };

            return batchActions([
                startAddNoteForEnrollment(enrollmentId, serverData, state.currentSelections, saveContext),
                addEnrollmentNote(enrollmentId, clientNote),
            ], batchActionTypes.ADD_NOTE_BATCH_FOR_ENROLLMENT);
        }));

export const removeNoteForEnrollmentEpic = (
    action$: EpicAction<unknown, { context: SaveContext }>,
) =>
    action$.pipe(
        ofType(actionTypes.ADD_NOTE_FAILED_FOR_ENROLLMENT),
        map((action: { meta: { context: SaveContext } }) =>
            removeEnrollmentNote(action.meta.context.enrollmentId, action.meta.context.noteClientId),
        ));
