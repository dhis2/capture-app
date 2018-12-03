// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SET_SELECTED_RELATIONSHIP_TYPE: 'SetSelectedRelationshipType',
    DESELECT_RELATIONSHIP_TYPE: 'DeselectRelationshipType';
};

export const setSelectedRelationshipType = (selectedRelationshipTypeId: string) =>
    actionCreator(actionTypes.SET_SELECTED_RELATIONSHIP_TYPE)({ selectedRelationshipTypeId });

export const deselectRelationshipType = () =>
    actionCreator(actionTypes.SET_SELECTED_RELATIONSHIP_TYPE)({ });
