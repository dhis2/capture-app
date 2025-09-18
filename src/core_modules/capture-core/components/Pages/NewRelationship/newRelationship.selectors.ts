import { createSelector } from 'reselect';

const relationshipTypeIdSelector = (state: any) => state.newRelationship.selectedRelationshipTypeId;
const relationshipTypesSelector = (state: any, props: any) => props.relationshipTypes;

export const makeSelectedRelationshipTypeSelector = () => createSelector(
    relationshipTypeIdSelector,
    relationshipTypesSelector,
    (relationshipTypeId: string, relationshipTypes: Array<any>) =>
        relationshipTypes.find((rt: any) => rt.id === relationshipTypeId),
);
