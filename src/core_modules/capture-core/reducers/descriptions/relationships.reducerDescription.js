// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as relationshipActionTypes,
} from '../../components/Relationships/relationships.actions';

export const relationshipsDesc = createReducerDescription({
    [relationshipActionTypes.SET_RELATIONSHIPS]: (state, action) => ({
        ...state,
        [action.payload.key]: action.payload.relationships,
    }),
    [relationshipActionTypes.ADD_RELATIONSHIP]: (state, action) => {
        const key = action.payload.key;
        const relationship = action.payload.relationship;

        return {
            ...state,
            [key]: [...state[key], relationship],
        };
    },
    [relationshipActionTypes.UPDATE_RELATIONSHIP]: (state, action) => {
        const key = action.payload.key;
        const updatedRelationship = action.payload.updatedRelationship;
        const index = state[key].findIndex(r => r.clientId === updatedRelationship.clientId);
        const newList = [...state[key]];
        newList[index] = updatedRelationship;

        return {
            ...state,
            [key]: newList,
        };
    },
    [relationshipActionTypes.REMOVE_RELATIONSHIP]: (state, action) => {
        const key = action.payload.key;
        const clientId = action.payload.relationshipClientId;

        return {
            ...state,
            [key]: state[key].filter(r => r.clientId !== clientId),
        };
    },
}, 'relationships');
