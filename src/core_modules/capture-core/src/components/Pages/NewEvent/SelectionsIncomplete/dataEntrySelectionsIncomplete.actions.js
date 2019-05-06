// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE: 'CancelNewEventFromIncompleteSelectionAndReturnToMainPage',
};

export const cancelNewEventFromIncompleteSelectionAndReturnToMainPage = () =>
    actionCreator(actionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE)();
