// @flow
import { actionCreator } from '../../../../actions/actions.utils';


export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'StartShowEditEventDataEntryForViewSingleEvent',
    SHOW_EDIT_EVENT_DATA_ENTRY: 'ShowEditEventDataEntryForViewSingleEvent',
};

export const viewEventIds = {
    dataEntryId: 'singleEvent',
    itemId: 'viewEvent',
};

export const startShowEditEventDataEntry = () =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)();

export const showEditEventDataEntry = () =>
    actionCreator(actionTypes.SHOW_EDIT_EVENT_DATA_ENTRY)();
