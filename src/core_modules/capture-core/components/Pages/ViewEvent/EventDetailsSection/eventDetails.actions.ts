import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    EVENT_DETAILS_LOADED: 'EventDetailsLoaded',
    UPDATE_EVENT_DETAILS_FIELD: 'UpdateEventDetailsField',
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'StartShowEditEventDataEntry',
};

export const eventDetailsLoaded = () =>
    actionCreator(actionTypes.EVENT_DETAILS_LOADED)();

export const updateEventDetailsField = (fieldId: string, value: any) =>
    actionCreator(actionTypes.UPDATE_EVENT_DETAILS_FIELD)({ fieldId, value });

export const showEditEventDataEntry = () =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)();
