// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/NewEvent/newEventSelections.actions';
import { actionTypes as selectorActionTypes } from '../../components/Pages/MainPage/tempSelector.actions';
import { actionTypes as newEventDataEntryActionTypes } from '../../components/Pages/NewEvent/DataEntry/newEventDataEntry.actions';

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
        newState.dataEntryIsLoading = true;
        return newState;
    },
    [selectorActionTypes.OPEN_NEW_EVENT_PAGE]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = true;
        return newState;
    },
    [newEventDataEntryActionTypes.SELECTIONS_NOT_COMPLETE_OPENING_NEW_EVENT]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        return newState;
    },
    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        return newState;
    },
}, 'newEventPage');
