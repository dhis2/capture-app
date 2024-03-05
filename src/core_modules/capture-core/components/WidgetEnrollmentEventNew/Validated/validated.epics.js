// @flow
import { ofType } from 'redux-observable';
import { v4 as uuid } from 'uuid';
import { map } from 'rxjs/operators';
import { newEventWidgetActionTypes, saveEvent, saveEventAndCompleteEnrollment } from './validated.actions';

import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';

export const saveNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventWidgetActionTypes.EVENT_SAVE_REQUEST),
        map((action) => {
            const state = store.value;
            const uid = uuid();
            const {
                formFoundation,
                dataEntryId,
                eventId,
                completed,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                fromClientDate,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;

            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);
            const { formClientValues, mainDataClientValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getAddEventEnrollmentServerData({
                formFoundation,
                formClientValues,
                mainDataClientValues,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                completed,
                fromClientDate,
                uid,
            });
            onSaveExternal && onSaveExternal(serverData, uid);
            return saveEvent(serverData, onSaveSuccessActionType, onSaveErrorActionType, uid);
        }),
    );

export const saveEventAndCompleteEnrollmentEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventWidgetActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST),
        map((action) => {
            const state = store.value;
            const uid = uuid();
            const {
                formFoundation,
                dataEntryId,
                eventId,
                completed,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                fromClientDate,
                onSaveAndCompleteEnrollmentExternal,
                onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveAndCompleteEnrollmentErrorActionType,
                enrollment,
            } = action.payload;

            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);
            const { formClientValues, mainDataClientValues } = getNewEventClientValues(
                state,
                dataEntryKey,
                formFoundation,
            );

            const newEvent = getAddEventEnrollmentServerData({
                formFoundation,
                formClientValues,
                mainDataClientValues,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                completed,
                fromClientDate,
                uid,
            }).events[0];

            const enrollmentWithAllEvents = enrollment.events
                ? { ...enrollment, events: [newEvent, ...enrollment.events] }
                : { ...enrollment, events: [newEvent] };
            const serverData = { enrollments: [enrollmentWithAllEvents] };

            onSaveAndCompleteEnrollmentExternal && onSaveAndCompleteEnrollmentExternal(enrollmentWithAllEvents);
            return saveEventAndCompleteEnrollment(
                serverData,
                onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveAndCompleteEnrollmentErrorActionType,
                uid,
            );
        }),
    );

