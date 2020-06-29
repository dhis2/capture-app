// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.container';

export const searchPageStatus = {
    INITIAL: 'INITIAL',
    NO_RESULTS: 'NO_RESULTS',
};


export const searchPageDesc = createReducerDescription({
    [searchPageActionTypes.SEARCH_RESULTS_EMPTY]: state => ({
        ...state,
        searchStatus: searchPageStatus.NO_RESULTS,
    }),
    [searchPageActionTypes.MODAL_CLOSE]: state => ({
        ...state,
        searchStatus: searchPageStatus.INITIAL,
    }),
}, 'searchPage', { searchStatus: searchPageStatus.INITIAL });
