// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SELECT_RELATIONSHIP_TYPE: 'SelectRelationshipType',
    DESELECT_RELATIONSHIP_TYPE: 'DeselectRelationshipType',
};

export const selectRelationshipType = (selectedRelationshipTypeId: string) =>
    actionCreator(actionTypes.SELECT_RELATIONSHIP_TYPE)({ selectedRelationshipTypeId });

export const deselectRelationshipType = () =>
    actionCreator(actionTypes.DESELECT_RELATIONSHIP_TYPE)({ });
