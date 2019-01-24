// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as teiSearchActionTypes,
} from '../../components/TeiSearch/actions/teiSearch.actions';

import {
    actionTypes as teiSearchOrgUnitActionTypes,
} from '../../components/TeiSearch/SearchOrgUnitSelector/searchOrgUnitSelector.actions';

import {
    actionTypes as teiSearchProgramActionTypes,
} from '../../components/TeiSearch/SearchProgramSelector/searchProgramSelector.actions';

import { set as setOrgUnitRoots } from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

export const teiSearchDesc = createReducerDescription({
    [teiSearchActionTypes.INITIALIZE_TEI_SEARCH]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {
            selectedOrgUnitScope: 'ACCESSIBLE',
            selectedProgramId: action.payload.programId,
            selectedTrackedEntityTypeId: action.payload.trackedEntityTypeId,
        },
    }),

    [teiSearchActionTypes.REQUEST_SEARCH_TEI]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {
            ...state[action.payload.searchId],
            showResults: true,
            resultsLoading: true,
        },
    }),
    [teiSearchActionTypes.SEARCH_TEI_RESULT_RETRIEVED]: (state, action) => {
        const data = action.payload.data;
        const searchId = action.payload.searchId;
        const results = {
            teis: data.trackedEntityInstanceContainers ? data.trackedEntityInstanceContainers.map(t => ({ id: t.id, values: t.values })) : [],
            paging: data.pagingData,
        };
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                resultsLoading: false,
                results,
            },
        };
    },
    [teiSearchActionTypes.SEARCH_TEI_FAILED]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                resultsLoading: false,
                results: [],
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SEARCH_ORG_UNITS]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                orgUnitSearchText: action.payload.searchText,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_CLEAR_ORG_UNITS_SEARCH]: (state, action) => {
        const searchId = action.payload.searchId;
        setOrgUnitRoots(searchId, null);
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchText: null,
                orgUnitSearchRoots: null,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SET_SEARCH_ORG_UNIT_RESULTS]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchText: action.payload.searchText,
                orgUnitSearchRoots: action.payload.roots,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SET_ORG_UNIT_SCOPE]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedOrgUnitScope: action.payload.orgUnitScope,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SET_ORG_UNIT]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedOrgUnit: action.payload.orgUnit,
            },
        };
    },
    [teiSearchActionTypes.SET_TEI_SEARCH_PROGRAM_AND_TET]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedProgramId: action.payload.programId,
                selectedTrackedEntityTypeId: action.payload.trackedEntityTypeId,
            },
        };
    },
    [teiSearchActionTypes.SEARCH_FORM_VALIDATION_FAILED]: (state, action) => {
        const searchId = action.payload.searchId;
        const formId = action.payload.formId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                [formId]: {
                    ...(state[searchId] ? state[searchId][formId] : {}),
                    validationFailed: true,
                },
            },
        };
    },
    [teiSearchActionTypes.TEI_NEW_SEARCH]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                showResults: false,
                resultsLoading: false,
                results: null,
            },
        };
    },
    [teiSearchActionTypes.TEI_EDIT_SEARCH]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                showResults: false,
                resultsLoading: false,
                results: null,
            },
        };
    },
}, 'teiSearch', {});
