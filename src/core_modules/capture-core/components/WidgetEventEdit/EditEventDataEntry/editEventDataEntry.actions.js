// @flow

import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';

export const batchActionTypes = {
    START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH: 'StartSaveEditEventDataEntryBatchForViewSingleEvent',
};


export const actionTypes = {
    CANCEL_EDIT_EVENT_DATA_ENTRY: 'CancelEditEventDataEntryForViewSingleEvent',
    REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY: 'RequestSaveEditEventDataEntryForViewSingleEvent',
    START_SAVE_EDIT_EVENT_DATA_ENTRY: 'StartSaveEditEventDataEntryForViewSingleEvent',
    EDIT_EVENT_DATA_ENTRY_SAVED: 'EditEventDataEntrySavedForViewSingleEvent',
    SAVE_EDIT_EVENT_DATA_ENTRY_FAILED: 'SaveEditEventDataEntryFailedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingEditEventDataEntryForViewSingleEvent',
};

export const cancelEditEventDataEntry = () =>
    actionCreator(actionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY)();

export const requestSaveEditEventDataEntry = (itemId: string, dataEntryId: string, formFoundation: Object, orgUnit: OrgUnit) =>
    actionCreator(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY)({ itemId, dataEntryId, formFoundation, orgUnit }, { skipLogging: ['formFoundation'] });


export const startSaveEditEventDataEntry = (eventId: string, serverData: Object, selections: Object, triggerActionCommit?: ?string, triggerActionRollback?: ?string) =>
    actionCreator(actionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY)({ selections }, {
        offline: {
            effect: {
                url: 'tracker?async=false&importStrategy=UPDATE',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED, meta: { selections, eventId, triggerAction: triggerActionCommit } },
            rollback: { type: actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED, meta: { selections, eventId, triggerAction: triggerActionRollback } },
        },
    });

export const prerequisitesErrorLoadingEditEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY)(message);
