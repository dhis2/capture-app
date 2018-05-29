// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as newEventSelectionActionTypes,
} from '../../components/Pages/NewEvent/newEventSelections.actions';
import { actionTypes as tempSelectorActionTypes } from '../../components/Pages/MainPage/tempSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../../components/Pages/NewEvent/DataEntry/newEventDataEntry.actions';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export const getAppReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.page };
        return newState;
    },
    [newEventSelectionActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.page };
        return newState;
    },
    [tempSelectorActionTypes.OPEN_NEW_EVENT_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = 'newEvent';
        newState.pageSwitchInTransition = true;
        return newState;
    },
    [newEventDataEntryActionTypes.START_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.pageSwitchInTransition = true;
        return newState;
    },
    [newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.pageSwitchInTransition = true;
        return newState;
    },
    [newEventDataEntryActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.pageSwitchInTransition = true;
        return newState;
    },
    [LOCATION_CHANGE]: (state) => {
        const newState = { ...state };
        newState.pageSwitchInTransition = false;
        return newState;
    },
}, 'app');
