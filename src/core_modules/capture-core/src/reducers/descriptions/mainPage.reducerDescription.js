// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { actionTypes as newEventDataEntryActionTypes } from '../../components/Pages/NewEvent/DataEntry/newEventDataEntry.actions';

export const mainPageDesc = createReducerDescription({
    [selectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state) => {
        const newState = { ...state };
        newState.prerequisitesForWorkingListMet = false;
        return newState;
    },
    [selectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.prerequisitesForWorkingListMet = false;
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
    [selectionsActionTypes.MAIN_SELECTIONS_COMPLETED]: (state) => {
        const newState = { ...state };
        newState.prerequisitesForWorkingListMet = true;
        return newState;
    },
    [newEventDataEntryActionTypes.START_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.newEventIsSaving = true;
        return newState;
    },
    [newEventDataEntryActionTypes.NEW_EVENT_SAVED]: (state) => {
        const newState = { ...state };
        newState.newEventIsSaving = false;
        return newState;
    },
}, 'mainPage');
