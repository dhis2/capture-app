// @flow

import { actionCreator } from '../../../../../actions/actions.utils';
import { methods } from '../../../../../trackerOffline/trackerOfflineConfig.const';

export const batchActionTypes = {
  START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH: 'StartSaveEditEventDataEntryBatchForViewSingleEvent',
};

export const actionTypes = {
  CANCEL_EDIT_EVENT_DATA_ENTRY: 'CancelEditEventDataEntryForViewSingleEvent',
  REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY: 'RequestSaveEditEventDataEntryForViewSingleEvent',
  START_SAVE_EDIT_EVENT_DATA_ENTRY: 'StartSaveEditEventDataEntryForViewSingleEvent',
  EDIT_EVENT_DATA_ENTRY_SAVED: 'EditEventDataEntrySavedForViewSingleEvent',
  SAVE_EDIT_EVENT_DATA_ENTRY_FAILED: 'SaveEditEventDataEntryFailedForViewSingleEvent',
  PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY:
    'PrerequisitesErrorLoadingEditEventDataEntryForViewSingleEvent',
};

export const cancelEditEventDataEntry = () =>
  actionCreator(actionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY)();

export const requestSaveEditEventDataEntry = (
  itemId: string,
  dataEntryId: string,
  formFoundation: Object,
) =>
  actionCreator(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY)(
    { itemId, dataEntryId, formFoundation },
    { skipLogging: ['formFoundation'] },
  );

export const startSaveEditEventDataEntry = (
  eventId: string,
  serverData: Object,
  selections: Object,
) =>
  actionCreator(actionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY)(
    { selections },
    {
      offline: {
        effect: {
          url: `events/${eventId}`,
          method: methods.UPDATE,
          data: serverData,
        },
        commit: { type: actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED, meta: { selections, eventId } },
        rollback: {
          type: actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED,
          meta: { selections, eventId },
        },
      },
    },
  );

export const prerequisitesErrorLoadingEditEventDataEntry = (message: string) =>
  actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY)(message);
