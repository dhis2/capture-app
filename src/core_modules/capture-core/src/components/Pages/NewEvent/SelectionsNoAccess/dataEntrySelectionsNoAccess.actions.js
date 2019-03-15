// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    CANCEL_NEW_EVENT_FROM_SELECTIONS_NO_ACCESS_RETURN_TO_MAIN_PAGE: 'CancelNewEventFromSelectionsNoAccessAndReturnToMainPage',
};

export const cancelNewEventFromSelectionsNoAccessAndReturnToMainPage = () =>
    actionCreator(actionTypes.CANCEL_NEW_EVENT_FROM_SELECTIONS_NO_ACCESS_RETURN_TO_MAIN_PAGE)();
