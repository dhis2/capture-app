import { actionCreator } from '../actions/actions.utils';

export const actionTypes = {
    CLEAN_UP_EVENT_LIST_IN_LOADING: 'CleanUpEventListInLoading',
};

export const cleanUpEventListInLoading = () =>
    actionCreator(actionTypes.CLEAN_UP_EVENT_LIST_IN_LOADING)();
