// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { dataEntryUrlActionTypes as newEventPageUrlActionTypes } from '../../components/Pages/NewEvent';
import { actionTypes as editEventPageUrlActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventPageUrlActionTypes } from '../../components/Pages/ViewEvent/viewEvent.actions';

export const mainPageDesc = createReducerDescription({
    [selectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state) => {
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
    [newEventPageUrlActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
    [editEventPageUrlActionTypes.EDIT_EVENT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
    [viewEventPageUrlActionTypes.VIEW_EVENT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
}, 'mainPage');
