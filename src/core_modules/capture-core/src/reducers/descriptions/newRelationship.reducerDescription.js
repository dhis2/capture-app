// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

export const newRelationshipPageDesc = createReducerDescription({
    [actionTypes.OPEN_NEW_RELATIONSHIP_PAGE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState.relationshipType = {};
        newState.relationshipFrom = {
            ...payload.from,
        };
        return newState;
    },
}, 'newRelationshipPage');
