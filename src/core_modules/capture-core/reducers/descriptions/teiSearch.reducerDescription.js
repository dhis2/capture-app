// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as teiSearchActionTypes,
} from '../../components/TeiSearch/actions/teiSearch.actions';

import {
    actionTypes as teiSearchOrgUnitActionTypes,
} from '../../components/TeiSearch/SearchOrgUnitSelector/searchOrgUnitSelector.actions';

import { set as setOrgUnitRoots } from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

export const teiSearchDesc = createReducerDescription({
    [teiSearchActionTypes.INITIALIZE_TEI_SEARCH]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {
            selectedOrgUnitScope: 'ACCESSIBLE',
            openSearchGroupSection: '0',
            selectedProgramId: action.payload.programId,
            selectedTrackedEntityTypeId: action.payload.trackedEntityTypeId,
        },
    }),

    [teiSearchActionTypes.REQUEST_SEARCH_TEI]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {
            ...state[action.payload.searchId],
            searchResults: {
                formId: action.payload.formId,
                searchGroupId: action.payload.searchGroupId,
                resultsLoading: true,
            },
        },
    }),
    [teiSearchActionTypes.SEARCH_TEI_RESULT_RETRIEVED]: (state, action) => {
        const {data} = action.payload;
        const {searchId} = action.payload;
        const teis = data.trackedEntityInstanceContainers ? data.trackedEntityInstanceContainers.map(t => ({ id: t.id, values: t.values })) : [];
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchResults: {
                    ...state[searchId].searchResults,
                    resultsLoading: false,
                    teis,
                    paging: data.pagingData,
                },
            },
        };
    },
    [teiSearchActionTypes.SEARCH_TEI_FAILED]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchResults: {
                    ...state[searchId].searchResults,
                    resultsLoading: false,
                    teis: [],
                    paging: null,
                },
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_REQUEST_FILTER_ORG_UNITS]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                orgUnitsLoading: true,
                orgUnitsSearchText: action.payload.searchText,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_CLEAR_ORG_UNITS_FILTER]: (state, action) => {
        const {searchId} = action.payload;
        setOrgUnitRoots(searchId, null);
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                orgUnitsLoading: false,
                orgUnitsSearchText: null,
                orgUnitsRoots: null,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_FILTERED_ORG_UNITS_RETRIEVED]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                orgUnitsLoading: false,
                orgUnitsSearchText: action.payload.searchText,
                orgUnitsRoots: action.payload.roots,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_FILTER_ORG_UNITS_FAILED]: (state, action) => {
        const {searchId} = action.payload;
        setOrgUnitRoots(searchId, null);
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                orgUnitsLoading: false,
                orgUnitsSearchText: null,
                orgUnitsRoots: null,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SET_ORG_UNIT_SCOPE]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedOrgUnitScope: action.payload.orgUnitScope,
            },
        };
    },
    [teiSearchOrgUnitActionTypes.TEI_SEARCH_SET_ORG_UNIT]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedOrgUnit: action.payload.orgUnit,
            },
        };
    },
    [teiSearchActionTypes.SET_TEI_SEARCH_PROGRAM_AND_TET]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                selectedProgramId: action.payload.programId,
                selectedTrackedEntityTypeId: action.payload.trackedEntityTypeId,
                openSearchGroupSection: '0',
            },
        };
    },
    [teiSearchActionTypes.SEARCH_FORM_VALIDATION_FAILED]: (state, action) => {
        const {searchId} = action.payload;
        const {formId} = action.payload;
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
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchResults: null,
            },
        };
    },
    [teiSearchActionTypes.TEI_EDIT_SEARCH]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchResults: null,
            },
        };
    },
    [teiSearchActionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                searchResults: {
                    ...state[searchId].searchResults,
                    resultsLoading: true,
                },
            },
        };
    },
    [teiSearchActionTypes.TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION]: (state, action) => {
        const {searchId} = action.payload;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                openSearchGroupSection: action.payload.searchGroupId,
            },
        };
    },
}, 'teiSearch', {});
