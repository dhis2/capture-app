// @flow
import { ofType } from 'redux-observable';
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import { newEventWidgetActionTypes, saveEvent } from './validated.actions';

import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';
import { addEnrollmentEventPageActionTypes } from '../../Pages/EnrollmentAddEvent/enrollmentAddEventPage.actions';
import {
    updateEnrollmentEventsWithoutId,
    commitEnrollmentEventWithoutId,
    rollbackEnrollmentEventWithoutId,
    saveFailed,
} from '../../Pages/common/EnrollmentOverviewDomain/enrollment.actions';

export const saveNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS),
        map((action) => {
            const meta = action.meta;
            const eventId = action.payload.response.importSummaries[0].reference;
            return commitEnrollmentEventWithoutId(meta.uid, eventId);
        }),
    );

export const saveNewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR),
        map((action) => {
            const meta = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEventWithoutId(meta.uid)]);
        }),
    );

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
                teiId,
                enrollmentId,
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
                teiId,
                enrollmentId,
                completed,
            });

            const orgUnit = serverData.events[0]?.orgUnit || '';
            const orgUnitName = state.organisationUnits[orgUnit]?.name || '';
            const eventData = { ...serverData.events[0], orgUnitName };

            onSaveExternal && onSaveExternal(serverData);
            return batchActions([
                updateEnrollmentEventsWithoutId(uid, eventData),
                saveEvent(serverData, onSaveSuccessActionType, onSaveErrorActionType, uid),
            ]);
        }),
    );
