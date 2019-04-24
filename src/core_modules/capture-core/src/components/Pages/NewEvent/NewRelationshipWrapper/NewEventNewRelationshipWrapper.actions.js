// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    NEW_EVENT_CANCEL_NEW_RELATIONSHIP: 'NewEventCancelNewRelationship',
    ADD_NEW_EVENT_RELATIONSHIP: 'AddNewEventRelationship',
    RECENTLY_ADDED_RELATIONSHIP: 'RecentlyAddedRelationship',
};

export const batchActionTypes = {
    ADD_RELATIONSHIP_BATCH: 'AddNewEventRelationshipBatch',
};

export const newEventCancelNewRelationship = () =>
    actionCreator(actionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP)({});

export const addNewEventRelationship = (relationshipType: { id: string, name: string }, entity: Object, entityType: string) =>
    actionCreator(actionTypes.ADD_NEW_EVENT_RELATIONSHIP)({ relationshipType, entity, entityType });

export const recentlyAddedRelationship = (relationshipId: string) =>
    actionCreator(actionTypes.RECENTLY_ADDED_RELATIONSHIP)({ relationshipId });
