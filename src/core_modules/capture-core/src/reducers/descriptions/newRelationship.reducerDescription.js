// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as newRelationshipActionTypes,
} from '../../components/Pages/NewRelationship/newRelationship.actions';
import {
    registerTeiActionTypes,
} from '../../components/Pages/NewRelationship';

export const newRelationshipDesc = createReducerDescription({
    [newRelationshipActionTypes.INITIALIZE_NEW_RELATIONSHIP]: () => ({}),
    [newRelationshipActionTypes.SELECT_RELATIONSHIP_TYPE]: (state, action) => ({
        ...state,
        selectedRelationshipType: action.payload.selectedRelationshipType,
        findMode: null,
    }),
    [newRelationshipActionTypes.SELECT_FIND_MODE]: (state, action) => ({
        ...state,
        findMode: action.payload.findMode,
        // loading: true,
        searching: false,
    }),
    [newRelationshipActionTypes.SET_SEARCHING]: state => ({
        ...state,
        searching: true,
    }),
    [newRelationshipActionTypes.UNSET_SEARCHING]: state => ({
        ...state,
        searching: false,
    }),
    [registerTeiActionTypes.INITIALIZE_REGISTER_TEI]: (state, action) => ({
        ...state,
        // loading: false,
    }),
}, 'newRelationship', {});

export const newRelationshipRegisterTeiDesc = createReducerDescription({
    [registerTeiActionTypes.INITIALIZE_REGISTER_TEI]: (state, action) => {
        const { programId, orgUnitId } = action.payload;
        return {
            ...state,
            programId,
            orgUnitId,
        };
    },
}, 'newRelationshipRegisterTei');
