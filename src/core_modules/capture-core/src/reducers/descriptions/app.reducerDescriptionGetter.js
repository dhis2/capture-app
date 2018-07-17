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
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import { actionTypes as connectivityActionTypes } from '../../components/Connectivity/connectivity.actions';
import {
    actionTypes as setCurrentSelectionsActionTypes,
} from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../components/Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as editEventPageSelectorActionTypes,
} from '../../components/Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as newEventPageSelectorActionTypes,
} from '../../components/Pages/NewEvent/NewEventSelector/NewEventSelector.actions';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
const OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';

export const getAppReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.nextPage };
        return newState;
    },
    [newEventSelectionActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.nextPage };
        return newState;
    },
    [editEventActionTypes.EDIT_EVENT_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.page };
        return newState;
    },
    [tempSelectorActionTypes.OPEN_NEW_EVENT_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = 'newEvent';
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [mainPageSelectorActionTypes.OPEN_NEW_EVENT]: (state) => {
        const newState = { ...state };
        newState.page = 'newEvent';
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventPageSelectorActionTypes.OPEN_NEW_EVENT]: (state) => {
        const newState = { ...state };
        newState.page = 'newEvent';
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventDataEntryActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [eventListActionTypes.OPEN_EDIT_EVENT_PAGE]: (state) => {
        const newState = {
            ...state,
            page: 'editEvent',
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [setCurrentSelectionsActionTypes.SET_ORG_UNIT_ID]: (state) => {
        const newState = {
            ...state,
            page: null,
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [setCurrentSelectionsActionTypes.SET_PROGRAM_ID]: (state) => {
        const newState = {
            ...state,
            page: null,
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [LOCATION_CHANGE]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = false;
        return newState;
    },
    [OFFLINE_STATUS_CHANGED]: (state, action) => {
        if (action.payload.online) {
            const newState = {
                ...state,
                goingOnlineInProgress: true,
            };
            return newState;
        }
        return state;
    },
    [connectivityActionTypes.GOING_ONLINE_EXECUTED]: (state) => {
        const newState = {
            ...state,
            goingOnlineInProgress: false,
        };
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [mainPageSelectorActionTypes.SET_ORG_UNIT]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [mainPageSelectorActionTypes.SET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const newState = {
            ...state,
            page: null,
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_ORG_UNIT]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const newState = {
            ...state,
            page: null,
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_CATEGORY_OPTION]: (state) => {
        const newState = {
            ...state,
            page: null,
            locationSwitchInProgress: true,
        };
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_ORG_UNIT]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.locationSwitchInProgress = true;
        return newState;
    },
}, 'app');
