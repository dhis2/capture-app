// @flow
import { batchActions } from 'redux-batched-actions';
import uuid from 'd2-utilizr/src/uuid';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    startSaveNewEventAddAnother,
} from '../newEventDataEntry.actions';

import {
    newRecentlyAddedEvent,
} from '../../RecentlyAddedEventsList/recentlyAddedEventsList.actions';

import {
    prependListItem,
    removeListItem,
} from '../../../../List/list.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';
import moment from '../../../../../utils/moment/momentResolver';
import { listId } from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';

export const saveNewEventAddAnotherEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER)
        .map((action) => {
            const state = store.getState();
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
            const clientEventValues = { ...formClientValues, created: moment().toISOString() };

            return batchActions([
                startSaveNewEventAddAnother(serverData, state.currentSelections),
                newRecentlyAddedEvent(clientEvent, clientEventValues),
                prependListItem(listId, clientEvent.eventId),
            ], newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH);
        });

export const saveNewEventAddAnotherFailedEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER)
        .map(() => {
            const clientId = '';
            return removeListItem(listId, clientId);
        });
