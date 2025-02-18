// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { actionTypes, batchActionTypes, startAddNoteForEnrollment, addEnrollmentNote }
    from './WidgetEnrollmentNote.actions';

const createServerData = (note, useNewEndpoint) => {
    if (useNewEndpoint) {
        return { value: note };
    }
    return { notes: [{ value: note }] };
};

export const addNoteForEnrollmentEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, fromClientDate }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_ENROLLMENT),
        switchMap((action) => {
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

                const clientNote = {
                    value: note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                };

                const saveContext = {
                    enrollmentId,
                    noteClientId: clientId,
                };

                return batchActions([
                    startAddNoteForEnrollment(enrollmentId, serverData, state.currentSelections, saveContext),
                    addEnrollmentNote(enrollmentId, clientNote),
                ], batchActionTypes.ADD_NOTE_BATCH_FOR_ENROLLMENT);
            });
        }));

