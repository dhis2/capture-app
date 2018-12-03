// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    NEW_EVENT_CANCEL_NEW_RELATIONSHIP: 'NewEventCancelNewRelationship',
};

export const newEventCancelNewRelationship = () =>
    actionCreator(actionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP)({});
