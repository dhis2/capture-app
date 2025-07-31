import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'StartShowEditEventDataEntryForViewSingleEvent',
    SHOW_EDIT_EVENT_DATA_ENTRY: 'ShowEditEventDataEntryForViewSingleEvent',
};

export const startShowEditEventDataEntry = (orgUnit: any, programCategory: any) =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)({ orgUnit, programCategory });

export const showEditEventDataEntry = () =>
    actionCreator(actionTypes.SHOW_EDIT_EVENT_DATA_ENTRY)();
