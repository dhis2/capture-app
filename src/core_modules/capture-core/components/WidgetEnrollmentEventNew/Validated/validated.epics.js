// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { newEventWidgetActionTypes, saveEvents } from './validated.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';

export const saveNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            newEventWidgetActionTypes.EVENT_SAVE_REQUEST,
        ),
        map((action) => {
            const state = store.value;
            const { requestEvent, referralEvent, relationship } = action.payload;

            const {
                eventId,
                formFoundation,
                dataEntryId,
                dataEntryItemId,
                completed,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                onSaveExternal,
            } = requestEvent;

            const {
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;

            const dataEntryKey = getDataEntryKey(dataEntryId, dataEntryItemId);
            const { formClientValues, mainDataClientValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const requestEventWithValues = getAddEventEnrollmentServerData({
                formFoundation,
                formClientValues,
                mainDataClientValues,
                eventId,
                programId,
                orgUnitId,
                orgUnitName,
                teiId,
                enrollmentId,
                completed,
            });

            const serverData = referralEvent ? {
                events: [requestEventWithValues, referralEvent],
                relationships: [relationship],
            } : {
                events: [requestEventWithValues],
            };

            onSaveExternal && onSaveExternal(serverData);
            return saveEvents({
                serverData,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                ...action.payload,
            });
        }),
    );
