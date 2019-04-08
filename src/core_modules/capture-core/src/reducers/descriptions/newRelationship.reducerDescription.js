// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as newRelationshipActionTypes,
} from '../../components/Pages/NewRelationship/newRelationship.actions';
import {
    registrationSectionActionTypes,
    dataEntryActionTypes,
    actionTypes as registerTeiActionTypes,
    searchGroupDuplicateActionTypes,
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
    [newRelationshipActionTypes.SELECT_FIND_MODE]: () => ({
        loading: true,
    }),
    [registerTeiActionTypes.REGISTER_TEI_INITIALIZE]: (state, action) => {
        const { programId, orgUnit } = action.payload;
        return {
            ...state,
            programId,
            orgUnit,
            dataEntryIsLoading: false,
            loading: false,
        };
    },
    [registerTeiActionTypes.REGISTER_TEI_INITIALIZE_FAILED]: (state, action) => ({
        ...state,
        error: action.payload.errorMessage,
        loading: false,
    }),
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
        dataEntryIsLoading: true,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN]: state => ({
        ...state,
        dataEntryIsLoading: false,
        dataEntryError: null,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN_FAILED]: (state, action) => ({
        ...state,
        dataEntryIsLoading: false,
        dataEntryError: action.payload.errorMessage,
    }),
    [dataEntryActionTypes.DATA_ENTRY_OPEN_CANCELLED]: state => ({
        ...state,
        dataEntryIsLoading: false,
        dataEntryError: null,
    }),
}, 'newRelationshipRegisterTei');

export const newRelationshipRegisterTeiDuplicatesReviewDesc = createReducerDescription({
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW]: state => ({
        ...state,
        isLoading: true,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS]: (state, action) => ({
        ...state,
        isLoading: false,
        teis: action.payload.teis,
        loadError: false,
        paginationData: { ...state.paginationData, ...action.payload.paginationData },
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED]: state => ({
        ...state,
        isLoading: false,
        loadError: true,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_CHANGE_PAGE]: (state, action) => ({
        ...state,
        isLoading: true,
        paginationData: { ...state.paginationData, currentPage: action.payload.page },
    }),
}, 'newRelationshipRegisterTeiDuplicatesReview');
