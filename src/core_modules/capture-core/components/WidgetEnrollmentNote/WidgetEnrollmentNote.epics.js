// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { actionTypes, batchActionTypes, startAddNoteForEnrollment, addEnrollmentNote }
    from './WidgetEnrollmentNote.actions';

export const addNoteForEnrollmentEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_ENROLLMENT),
        switchMap((action) => {
            const state = store.value;
            const { enrollmentId, note } = action.payload;
            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName, surname, userName',
                },
            }).then((user) => {
                const { firstName, surname, userName } = user;
                const clientId = uuid();

                const serverData = {
                    notes: [{ value: note }],
                };

                const clientNote = {
                    value: note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    updatedAt: moment().toISOString(),
                    storedBy: userName,
                    storedAt: moment().toISOString(),
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

