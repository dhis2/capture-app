// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.container';

export const searchPageStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    SHOW_RESULTS: 'SHOW_RESULTS',
    ERROR: 'ERROR',
};

export const searchPageDesc = createReducerDescription({
    [searchPageActionTypes.SEARCH_RESULTS_INITIAL_VIEW]: state => ({
        ...state,
        searchStatus: searchPageStatus.INITIAL,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_SUCCESS_VIEW]: (state, { payload: { searchResults, searchResultsPaginationInfo } }) => ({
        ...state,
        searchStatus: searchPageStatus.SHOW_RESULTS,
        searchResults,
        searchResultsPaginationInfo,
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
        generalPurposeErrorMessage: 'This is a general purpose error. This text needs to be defined',
    }),
    [searchPageActionTypes.PAGINATION_CHANGE]: (state, { payload: { newPage } }) => ({
        ...state,
        searchResultsPaginationInfo: {
            ...state.searchResultsPaginationInfo,
            currentPage: newPage,
        },
    }),
}, 'searchPage', {
    searchStatus: searchPageStatus.INITIAL,
    searchResults: [],
    searchResultsPaginationInfo: {
        rowsCount: 0,
        rowsPerPage: 0,
        currentPage: 0,
    },
});
