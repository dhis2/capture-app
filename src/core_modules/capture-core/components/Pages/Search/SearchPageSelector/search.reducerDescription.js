// @flow
import { createReducerDescription } from '../../../../trackerRedux';
import { searchPageSelectorActonTypes } from './SearchPageSelector.actions';

export const searchPageDesc = createReducerDescription({
    [searchPageSelectorActonTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = true;
        return newState;
    },
    [searchPageSelectorActonTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = null;
        newState.dataEntryIsLoading = false;
        return newState;
    },
}, 'searchPage');
