// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector';

export const searchPageDesc = createReducerDescription({
    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE]: state => ({
        ...state,
        isLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_VALID]: state => ({
        ...state,
        selectionsError: null,
        isLoading: false,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_INVALID]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_ERROR_RETRIEVING]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
}, 'activePage');
