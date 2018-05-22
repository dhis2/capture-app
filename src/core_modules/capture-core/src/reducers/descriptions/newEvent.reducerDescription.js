// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/NewEvent/newEventSelections.actions';

export const newEventPageDesc = createReducerDescription({
    [selectionsActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = true;
        return newState;
    },
    [selectionsActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [selectionsActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [selectionsActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [selectionsActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = null;
        return newState;
    },
}, 'newEventPage');
