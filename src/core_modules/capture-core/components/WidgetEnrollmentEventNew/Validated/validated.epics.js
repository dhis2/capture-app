// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'uuid/v4';

import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedAddEvent';
import { newEventWidgetActionTypes, saveEvent } from './validated.actions';

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
            });

            onSaveExternal && onSaveExternal(serverData, uid);
            return saveEvent(serverData, onSaveSuccessActionType, onSaveErrorActionType, uid);
        }),
    );
