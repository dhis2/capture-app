// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import { moment } from 'capture-core-utils/moment/momentResolver';
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
                ...state.enrollmentDomain.enrollment,
                notes: [{ value: note }],
            };

            const clientNote = {
                value: note,
                lastUpdatedBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                lastUpdated: moment().toISOString(),
                storedBy: userName,
                storedDate: moment().toISOString(),
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

