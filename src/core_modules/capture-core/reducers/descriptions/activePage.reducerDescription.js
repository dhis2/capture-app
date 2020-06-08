// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/actions';

export const searchPageDesc = createReducerDescription({
    [lockedSelectorActionTypes.SET_ORG_UNIT]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: state => ({
        ...state,
        isLoading: true,
    }),
    [lockedSelectorActionTypes.VALID_SELECTIONS_FROM_URL]: state => ({
        ...state,
        selectionsError: null,
        isLoading: false,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
}, 'activePage');
