// @flow
import { createSelector } from 'reselect';

const relationshipTypeIdSelector = state => state.newRelationship.selectedRelationshipTypeId;
const relationshipTypesSelector = (state, props) => props.relationshipTypes;

export const makeSelectedRelationshipTypeSelector = () => createSelector(
    relationshipTypeIdSelector,
    relationshipTypesSelector,
    (relationshipTypeId: string, relationshipTypes: Array<Object>) => relationshipTypes.find(rt => rt.id === relationshipTypeId),
);
