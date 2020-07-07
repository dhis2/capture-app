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
    [searchPageActionTypes.MODAL_CLOSE]: state => ({
        ...state,
        searchStatus: searchPageStatus.INITIAL,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_SUCCESS]: (state, { payload: { searchResults } }) => ({
        ...state,
        searchStatus: searchPageStatus.SHOW_RESULTS,
        searchResults,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_LOADING]: state => ({
        ...state,
        searchStatus: searchPageStatus.LOADING,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_EMPTY]: state => ({
        ...state,
        searchStatus: searchPageStatus.NO_RESULTS,
    }),
    [searchPageActionTypes.SEARCH_RESULTS_ERROR]: state => ({
        ...state,
        searchStatus: searchPageStatus.ERROR,
        generalPurposeErrorMessage: 'This is a general purpose error. This text needs to be defined',
    }),
}, 'searchPage', { searchStatus: searchPageStatus.INITIAL });
