// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
} from '../../components/DataEntries/SingleEventRegistrationEntry';
import { eventWorkingListsActionTypes } from '../../components/Pages/MainPage/EventWorkingLists';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as connectivityActionTypes } from '../../components/Connectivity/connectivity.actions';
import {
    actionTypes as setCurrentSelectionsActionTypes,
} from '../../components/LockedSelector/QuickSelector/actions/QuickSelector.actions';
import {
    lockedSelectorActionTypes,
} from '../../components/LockedSelector';
import { viewEventPageActionTypes } from '../../components/Pages/ViewEvent/ViewEventPage.actions';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.actions';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
const OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';

export const getAppReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [editEventActionTypes.EDIT_EVENT_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.page };
        return newState;
    },
    [viewEventActionTypes.VIEW_EVENT_FROM_URL]: (state, action) => {
        const newState = { ...state, page: action.payload.page };
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
    [viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN]: (state) => {
        const newState = {
            ...state,
            page: 'viewEvent',
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

    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: state => ({
        ...state,
        locationSwitchInProgress: true,
    }),
    [lockedSelectorActionTypes.PROGRAM_ID_SET]: state => ({
        ...state,
        locationSwitchInProgress: true,
    }),
    [lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_UPDATE]: (state, action) => ({
        ...state,
        page: action.payload.nextPage,
    }),
    [lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN]: state => ({
        ...state,
        page: 'new',
        locationSwitchInProgress: true,
    }),
    [lockedSelectorActionTypes.ORG_UNIT_ID_RESET]: state => ({
        ...state,
        locationSwitchInProgress: true,
    }),
    [lockedSelectorActionTypes.PROGRAM_ID_RESET]: state => ({
        ...state,
        locationSwitchInProgress: true,
    }),
    [viewEventPageActionTypes.ORG_UNIT_ID_CUSTOM_RESET]: state => ({
        ...state,
        page: null,
    }),
    [viewEventPageActionTypes.PROGRAM_ID_CUSTOM_RESET]: state => ({
        ...state,
        page: null,
    }),
    [searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE]: state => ({
        ...state,
        page: null,
        locationSwitchInProgress: true,
    }),
    [lockedSelectorActionTypes.SEARCH_PAGE_OPEN]: state => ({
        ...state,
        page: 'search',
        locationSwitchInProgress: true,
    }),
}, 'app');
