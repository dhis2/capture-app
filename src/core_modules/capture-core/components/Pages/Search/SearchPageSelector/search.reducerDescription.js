// @flow
import { createReducerDescription } from '../../../../trackerRedux';
import { searchPageSelectorActonTypes } from './SearchPageSelector.actions';

export const searchPageDesc = createReducerDescription({
    [searchPageSelectorActonTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state, isLoading: true };
        return newState;
    },
    [searchPageSelectorActonTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state, isLoading: false };
        return newState;
    },
}, 'searchPage');
