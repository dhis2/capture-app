// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SELECT_RELATIONSHIP_TYPE: 'SelectRelationshipType',
    DESELECT_RELATIONSHIP_TYPE: 'DeselectRelationshipType',
    SELECT_FIND_MODE: 'SelectFindMode',
};

export const selectRelationshipType = (selectedRelationshipTypeId: string) =>
    actionCreator(actionTypes.SELECT_RELATIONSHIP_TYPE)({ selectedRelationshipTypeId });

export const deselectRelationshipType = () =>
    actionCreator(actionTypes.DESELECT_RELATIONSHIP_TYPE)({ });

export const selectFindMode = (findMode: string) =>
    actionCreator(actionTypes.SELECT_FIND_MODE)({ findMode });
