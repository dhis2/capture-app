// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { actionTypes, batchActionTypes, startAddNoteForEnrollment, addEnrollmentNote }
    from './WidgetEnrollmentComment.actions';
import { getCurrentUser } from '../../d2/d2Instance';

export const addNoteForEnrollmentEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_ADD_NOTE_FOR_ENROLLMENT),
        map((action) => {
            const state = store.value;
            const { enrollmentId, note } = action.payload;
            // $FlowFixMe[prop-missing] automated comment
            const { firstName, surname, userName } = getCurrentUser();
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
        }));

