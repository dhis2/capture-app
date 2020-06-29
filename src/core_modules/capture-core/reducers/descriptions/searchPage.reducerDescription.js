// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.container';

export const searchPageDesc = createReducerDescription({
    [searchPageActionTypes.SEARCH_RESULTS_EMPTY]: state => ({
        ...state,
        searchStatus: 'RESULTS_EMPTY',
    }),
    [searchPageActionTypes.MODAL_CLOSE]: state => ({
        ...state,
        searchStatus: 'SEARCHING',
    }),
}, 'searchPage', { searchStatus: '' });
