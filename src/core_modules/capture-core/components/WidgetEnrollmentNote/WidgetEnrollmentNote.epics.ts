import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import type { ReduxStore, ApiUtils, EpicAction } from '../../../capture-core-utils/types/global';
import { actionTypes, batchActionTypes, startAddNoteForEnrollment, addEnrollmentNote }
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
    { querySingleResource, fromClientDate }: ApiUtils
) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_ENROLLMENT),
        switchMap((action: { payload: AddNoteActionPayload }) => {
            const state = store.value;
            const { enrollmentId, note } = action.payload;
            const useNewEndpoint = featureAvailable(FEATURES.newNoteEndpoint);
            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName, surname, userName',
                },
            }).then((user) => {
                const { firstName, surname, userName } = user;
                const clientId = uuid();

                const serverData = createServerData(note, useNewEndpoint);

                const clientNote: ClientNote = {
                    value: note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                };

                const saveContext: SaveContext = {
                    enrollmentId,
                    noteClientId: clientId,
                };

                return batchActions([
                    startAddNoteForEnrollment(enrollmentId, serverData, state.currentSelections, saveContext),
                    addEnrollmentNote(enrollmentId, clientNote),
                ], batchActionTypes.ADD_NOTE_BATCH_FOR_ENROLLMENT);
            });
        }));
