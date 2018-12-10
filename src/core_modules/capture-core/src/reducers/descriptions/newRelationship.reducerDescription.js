// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as newRelationshipActionTypes,
} from '../../components/Pages/NewRelationship/newRelationship.actions';

export const newRelationshipDesc = createReducerDescription({
    [newRelationshipActionTypes.SELECT_RELATIONSHIP_TYPE]: (state, action) => {
        const newState = {
            ...state,
            selectedRelationshipTypeId: action.payload.selectedRelationshipTypeId,
        };
        return newState;
    },
    [newRelationshipActionTypes.DESELECT_RELATIONSHIP_TYPE]: (state) => {
        const newState = {
            ...state,
            findMode: null,
            selectedRelationshipTypeId: null,
        };
        return newState;
    },
    [newRelationshipActionTypes.SELECT_FIND_MODE]: (state, action) => {
        const newState = { ...state };
        newState.findMode = action.payload.findMode;
        return newState;
    },
}, 'newRelationship', {});
