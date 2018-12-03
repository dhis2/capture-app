// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as newRelationshipActionTypes,
} from '../../components/Pages/NewRelationship/newRelationship.actions';

export const newRelationshipDesc = createReducerDescription({
    [newRelationshipActionTypes.SET_SELECTED_RELATIONSHIP_TYPE]: (state, action) => {
        const newState = { ...state };
        newState.selectedRelationshipTypeId = action.payload.selectedRelationshipTypeId;
        return newState;
    },
    [newRelationshipActionTypes.DESELECT_RELATIONSHIP_TYPE]: (state, action) => {
        const newState = { ...state };
        newState.selectedRelationshipTypeId = null;
        return newState;
    }
}, 'newRelationship', {});
