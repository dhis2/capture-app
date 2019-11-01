// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    NEW_RECENTLY_ADDED_EVENT:
        'newRecentlyAddedEvent',
};

export const newRecentlyAddedEvent = (event, eventValues) =>
    actionCreator(actionTypes.NEW_RECENTLY_ADDED_EVENT)({ event, eventValues });
