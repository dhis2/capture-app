// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as newRelationshipActionTypes,
} from '../../components/Pages/NewRelationship/newRelationship.actions';
import {
    registrationSectionActionTypes,
    dataEntryActionTypes,
    actionTypes as registerTeiActionTypes,
} from '../../components/Pages/NewRelationship/RegisterTei';

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
        loading: true,
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
    [registerTeiActionTypes.INITIALIZE_REGISTER_TEI]: state => ({
        ...state,
        loading: false,
    }),
}, 'newRelationship', {});

export const newRelationshipRegisterTeiDesc = createReducerDescription({
    [registerTeiActionTypes.INITIALIZE_REGISTER_TEI]: (state, action) => {
        const { programId, orgUnit } = action.payload;
        return {
            ...state,
            programId,
            orgUnit,
            dataEntryIsLoading: false,
        };
    },
    [registrationSectionActionTypes.PROGRAM_CHANGE]: (state, action) => {
        const { programId } = action.payload;
        return {
            ...state,
            programId,
            dataEntryIsLoading: true,
        };
    },
    [registrationSectionActionTypes.ORG_UNIT_CHANGE]: (state, action) => {
        const { orgUnit, resetProgramSelection } = action.payload;
        return {
            ...state,
            orgUnit,
            programId: resetProgramSelection ? null : state.programId,
            dataEntryIsLoading: true,
        };
    },
    [registrationSectionActionTypes.PROGRAM_FILTER_CLEAR]: state => ({
        ...state,
        orgUnit: null,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN_CANCELLED]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
}, 'newRelationshipRegisterTei');
