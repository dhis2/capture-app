// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchBoxActionTypes } from '../../components/SearchBox';

export const searchBoxStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    SHOW_RESULTS: 'SHOW_RESULTS',
    ERROR: 'ERROR',
    TOO_MANY_RESULTS: 'TOO_MANY_RESULTS',
    NOT_ENOUGH_ATTRIBUTES: 'NOT_ENOUGH_ATTRIBUTES',
    UNIQUE_SEARCH_VALUE_EMPTY: 'UNIQUE_SEARCH_VALUE_EMPTY',
};
const initialReducerValue = {
    searchStatus: searchBoxStatus.INITIAL,
    searchResults: [],
    currentPage: 0,
    currentSearchInfo: {},
    keptFallbackSearchFormValues: {},
    otherCurrentPage: 0,
};

export const searchDomainDesc = createReducerDescription({
    [searchBoxActionTypes.SEARCH_RESULTS_INITIAL_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.INITIAL,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { searchResults, currentPage } }) => ({
        ...state,
        searchStatus: searchBoxStatus.SHOW_RESULTS,
        searchResults,
        currentPage,
    }),
    [searchBoxActionTypes.ADD_SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { otherResults, otherCurrentPage } }) => ({
        ...state,
        searchStatus: searchBoxStatus.SHOW_RESULTS,
        otherResults,
        otherCurrentPage,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_LOADING_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.LOADING,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_EMPTY_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.NO_RESULTS,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_ERROR_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.ERROR,
    }),
    [searchBoxActionTypes.SEARCH_RESULTS_TOO_MANY_VIEW]: state => ({
        ...state,
        searchStatus: searchBoxStatus.TOO_MANY_RESULTS,
    }),
    [searchBoxActionTypes.FALLBACK_NOT_ENOUGH_ATTRIBUTES]: (state, { payload }) => ({
        ...state,
        searchStatus: searchBoxStatus.NOT_ENOUGH_ATTRIBUTES,
        searchableFields: payload.searchableFields,
        minAttributesRequiredToSearch: payload.minAttributesRequiredToSearch,
    }),
    [searchBoxActionTypes.CURRENT_SEARCH_INFO_SAVE]: (state, { payload: { searchScopeType, searchScopeId, formId, currentSearchTerms } }) => ({
        ...state,
        currentSearchInfo: { searchScopeType, searchScopeId, formId, currentSearchTerms },
        otherResults: undefined,
        otherCurrentPage: 0,
    }),
    [searchBoxActionTypes.FALLBACK_SEARCH]: (state, { payload: { fallbackFormValues, trackedEntityTypeId } }) => ({
        ...state,
        keptFallbackSearchFormValues: { ...fallbackFormValues, trackedEntityTypeId },
    }),

    [searchBoxActionTypes.ALL_SEARCH_RELATED_DATA_CLEAN]: () => (initialReducerValue),
    [searchBoxActionTypes.FALLBACK_SEARCH_RELATED_DATA_CLEAN]: state => ({
        ...state,
        keptFallbackSearchFormValues: {},
    }),
    [searchBoxActionTypes.SEARCH_UNIQUE_SEARCH_VALUE_EMPTY]: (state, { payload }) => ({
        ...state,
        searchStatus: searchBoxStatus.UNIQUE_SEARCH_VALUE_EMPTY,
        currentSearchInfo: { uniqueTEAName: payload.uniqueTEAName },
    }),

}, 'searchDomain', initialReducerValue);
