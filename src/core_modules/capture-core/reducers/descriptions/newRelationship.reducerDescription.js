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
import {
    registrationSectionActionTypes as registrationSectionActionTypesRelationshipsWidget,
    dataEntryActionTypes as dataEntryActionTypesRelationshipsWidget,
    actionTypes as registerTeiActionTypesRelationshipsWidget,
} from '../../components/Pages/common/TEIRelationshipsWidget/RegisterTei';

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
}, 'newRelationship', {});

export const newRelationshipRegisterTeiDesc = createReducerDescription({
    [registerTeiActionTypes.REGISTER_TEI_INITIALIZE]: (state, action) => {
        const { programId, orgUnit } = action.payload;
        return {
            ...state,
            programId,
            orgUnit,
        };
    },
    [registerTeiActionTypes.REGISTER_TEI_INITIALIZE_FAILED]: (state, action) => ({
        ...state,
        error: action.payload.errorMessage,
    }),
    [registrationSectionActionTypes.PROGRAM_CHANGE]: (state, action) => {
        const { programId } = action.payload;
        return {
            ...state,
            programId,
        };
    },
    [registrationSectionActionTypes.ORG_UNIT_CHANGE]: (state, action) => {
        const { orgUnit, resetProgramSelection } = action.payload;
        return {
            ...state,
            orgUnit,
            programId: resetProgramSelection ? null : state.programId,
        };
    },
    [registrationSectionActionTypes.PROGRAM_FILTER_CLEAR]: state => ({
        ...state,
        orgUnit: null,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN]: state => ({
        ...state,
        dataEntryError: null,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN_FAILED]: (state, action) => ({
        ...state,
        dataEntryError: action.payload.errorMessage,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN_CANCELLED]: state => ({
        ...state,
        dataEntryError: null,
    }),
    [registerTeiActionTypesRelationshipsWidget.REGISTER_TEI_INITIALIZE]: (state, action) => {
        const { programId, orgUnit } = action.payload;
        return {
            ...state,
            programId,
            orgUnit,
        };
    },
    [registerTeiActionTypesRelationshipsWidget.REGISTER_TEI_INITIALIZE_FAILED]: (state, action) => ({
        ...state,
        error: action.payload.errorMessage,
    }),
    [registrationSectionActionTypesRelationshipsWidget.PROGRAM_CHANGE]: (state, action) => {
        const { programId } = action.payload;
        return {
            ...state,
            programId,
        };
    },
    [registrationSectionActionTypesRelationshipsWidget.ORG_UNIT_CHANGE]: (state, action) => {
        const { orgUnit, resetProgramSelection } = action.payload;
        return {
            ...state,
            orgUnit,
            programId: resetProgramSelection ? null : state.programId,
        };
    },
    [registrationSectionActionTypesRelationshipsWidget.PROGRAM_FILTER_CLEAR]: state => ({
        ...state,
        orgUnit: null,
    }),
    [dataEntryActionTypesRelationshipsWidget.DATA_ENTRY_OPEN]: state => ({
        ...state,
        dataEntryError: null,
    }),
    [dataEntryActionTypesRelationshipsWidget.DATA_ENTRY_OPEN_FAILED]: (state, action) => ({
        ...state,
        dataEntryError: action.payload.errorMessage,
    }),
    [dataEntryActionTypesRelationshipsWidget.DATA_ENTRY_OPEN_CANCELLED]: state => ({
        ...state,
        dataEntryError: null,
    }),
}, 'newRelationshipRegisterTei');
