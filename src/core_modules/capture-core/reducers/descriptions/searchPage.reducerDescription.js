// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.container';

export const searchPageStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    ERROR: 'ERROR',
};

export const searchPageDesc = createReducerDescription({
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
        errorMessage: 'There is an error please be aware.',
    }),
    [searchPageActionTypes.MODAL_CLOSE]: state => ({
        ...state,
        searchStatus: searchPageStatus.INITIAL,
    }),
}, 'searchPage', { searchStatus: searchPageStatus.INITIAL });
