// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    NEW_EVENT_CANCEL_NEW_RELATIONSHIP: 'NewEventCancelNewRelationship',
    ADD_NEW_EVENT_RELATIONSHIP: 'AddNewEventRelationship',
};

export const newEventCancelNewRelationship = () =>
    actionCreator(actionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP)({});

export const addNewEventRelationship = (relationshipTypeId: string, entityId: string, entityType: string) =>
    actionCreator(actionTypes.ADD_NEW_EVENT_RELATIONSHIP)({ relationshipTypeId, entityId, entityType });
