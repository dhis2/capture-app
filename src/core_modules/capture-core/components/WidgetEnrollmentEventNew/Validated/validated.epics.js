// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    newEventWidgetActionTypes,
    saveEvent,
} from './validated.actions';

import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';

export const saveNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventWidgetActionTypes.EVENT_SAVE_REQUEST),
        map((action) => {
            const state = store.value;
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

            onSaveExternal && onSaveExternal(serverData);
            return saveEvent(serverData, onSaveSuccessActionType, onSaveErrorActionType);
        }));
