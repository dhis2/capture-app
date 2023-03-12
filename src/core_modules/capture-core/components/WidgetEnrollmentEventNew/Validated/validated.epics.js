// @flow
import { ofType } from 'redux-observable';
import { v4 as uuid } from 'uuid';
import { map } from 'rxjs/operators';
import { newEventWidgetActionTypes, saveEvent } from './validated.actions';

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
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                categoryCombinationForm,
            } = action.payload;

            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);
            const { formClientValues, mainDataClientValues, categoryValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation, categoryCombinationForm);

            const serverData = getAddEventEnrollmentServerData({
                formFoundation,
                formClientValues,
                mainDataClientValues: { ...mainDataClientValues, attributeCategoryOptions: categoryValues },
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
