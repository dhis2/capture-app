// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.actions';

export const searchPageStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    SHOW_RESULTS: 'SHOW_RESULTS',
    ERROR: 'ERROR',
    TOO_MANY_RESULTS: 'TOO_MANY_RESULTS',
    NOT_ENOUGH_ATTRIBUTES: 'NOT_ENOUGH_ATTRIBUTES',
};
const initialReducerValue = {
    searchStatus: searchPageStatus.INITIAL,
    searchResults: [],
    currentPage: 0,
    currentSearchInfo: {},
    keptFallbackSearchFormValues: {},
    otherCurrentPage: 0,
};
export const searchPageDesc = createReducerDescription({
    [searchPageActionTypes.SEARCH_RESULTS_INITIAL_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.INITIAL,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { searchResults, currentPage } }) => ({
        ...state,
        searchStatus: searchPageStatus.SHOW_RESULTS,
        searchResults,
        currentPage,
    }),
    [searchPageActionTypes.ADD_SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { otherResults, otherCurrentPage } }) => ({
        ...state,
        searchStatus: searchPageStatus.SHOW_RESULTS,
        otherResults,
        otherCurrentPage,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_LOADING_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.LOADING,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_EMPTY_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.NO_RESULTS,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_ERROR_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.ERROR,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_TOO_MANY_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.TOO_MANY_RESULTS,
    }),
    [searchPageActionTypes.FALLBACK_NOT_ENOUGH_ATTRIBUTES]: (state, { payload }) => ({
        ...state,
        searchStatus: searchPageStatus.NOT_ENOUGH_ATTRIBUTES,
        searchableFields: payload.searchableFields,
        minAttributesRequiredToSearch: payload.minAttributesRequiredToSearch,
    }),
    [searchPageActionTypes.CURRENT_SEARCH_INFO_SAVE]: (state, { payload: { searchScopeType, searchScopeId, formId, currentSearchTerms } }) => ({
        ...state,
        currentSearchInfo: { searchScopeType, searchScopeId, formId, currentSearchTerms },
        otherResults: undefined,
        otherCurrentPage: 0,
    }),
    [searchPageActionTypes.FALLBACK_SEARCH]: (state, { payload: { fallbackFormValues, trackedEntityTypeId } }) => ({
        ...state,
        keptFallbackSearchFormValues: { ...fallbackFormValues, trackedEntityTypeId },
    }),

    [searchPageActionTypes.ALL_SEARCH_RELATED_DATA_CLEAN]: () => (initialReducerValue),
    [searchPageActionTypes.FALLBACK_SEARCH_RELATED_DATA_CLEAN]: state => ({
        ...state,
        keptFallbackSearchFormValues: {},
    }),

}, 'searchPage', initialReducerValue);
