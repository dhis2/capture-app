// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT:
        'UpdateEventListAfterSaveOrUpdateForSingleEvent',
};

export const updateEventListAfterSaveOrUpdateSingleEvent = () =>
    actionCreator(actionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT)();
