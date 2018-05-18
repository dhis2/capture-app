// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    OPEN_NEW_EVENT_PAGE: 'OpenNewEventPage',
};

export const openNewEventPage = () => actionCreator(actionTypes.OPEN_NEW_EVENT_PAGE)();
