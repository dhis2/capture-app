// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectorActionTypes } from '../../components/Pages/MainPage/tempSelector.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
    dataEntryUrlActionTypes as newEventdataEntryUrlActionTypes,
    selectionsCompleteActionTypes as newEventSelectionsCompleteActionTypes,
    selectorActionTypes as newEventSelectorActionTypes,
} from '../../components/Pages/NewEvent';
import {
    actionTypes as editEventPageActionTypes,
} from '../../components/Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../components/Pages/MainPage/MainPageSelector/MainPageSelector.actions';

export const newEventPageDesc = createReducerDescription({
    [newEventdataEntryUrlActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = true;
        return newState;
    },
    [newEventdataEntryUrlActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [newEventdataEntryUrlActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [newEventdataEntryUrlActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload;
        return newState;
    },
    [newEventdataEntryUrlActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = null;
        newState.dataEntryIsLoading = true;
        return newState;
    },
    [selectorActionTypes.OPEN_NEW_EVENT_PAGE]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = true;
        newState.selectionsError = null;
        return newState;
    },
    [editEventPageActionTypes.OPEN_NEW_EVENT]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = true;
        return newState;
    },
    [mainPageSelectorActionTypes.OPEN_NEW_EVENT]: (state) => {
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
    [newEventSelectionsCompleteActionTypes.SET_NEW_EVENT_FORM_LAYOUT_DIRECTION]: (state, action) => {
        const newState = { ...state };
        newState.formHorizontal = action.payload.formHorizontal;
        return newState;
    },
    [newEventDataEntryActionTypes.SET_NEW_EVENT_SAVE_TYPES]: (state, action) => {
        const newState = { ...state };
        newState.saveTypes = action.payload.saveTypes;
        return newState;
    },
    [newEventSelectorActionTypes.SET_ORG_UNIT]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
}, 'newEventPage');
