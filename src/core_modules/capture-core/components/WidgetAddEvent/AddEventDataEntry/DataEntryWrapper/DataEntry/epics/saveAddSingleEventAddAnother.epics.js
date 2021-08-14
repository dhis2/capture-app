// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    startSaveNewEventAddAnother,
} from '../actions/dataEntry.actions';

import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';

export const saveNewEventAddAnotherEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_ADD_EVENT_ADD_ANOTHER),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const formFoundation = payload.formFoundation;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);

            const { formClientValues, mainDataClientValues } = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getNewEventServerData(state, formFoundation, formClientValues, mainDataClientValues);
            const clientEvent = {
                ...mainDataClientValues,
                eventId: uuid(),
                programId: state.currentSelections.programId,
                programStageId: formFoundation.id,
                orgUnitId: state.currentSelections.orgUnitId,
            };
            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return batchActions([
                startSaveNewEventAddAnother(serverData, relationshipData, state.currentSelections, clientEvent.eventId),
            ], newEventDataEntryBatchActionTypes.SAVE_ADD_EVENT_ADD_ANOTHER_BATCH);
        }));

