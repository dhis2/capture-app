// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
} from '../../components/DataEntries/SingleEventRegistrationEntry';
import { eventWorkingListsActionTypes } from '../../components/WorkingLists/EventWorkingLists';
import { actionTypes as editEventActionTypes }
    from '../../components/Pages/ViewEvent/ViewEventComponent/editEvent.actions';
import { actionTypes as viewEventActionTypes }
    from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { newPageActionTypes }
    from '../../components/Pages/New/NewPage.actions';
import { actionTypes as connectivityActionTypes } from '../../components/Connectivity/connectivity.actions';
import {
    actionTypes as setCurrentSelectionsActionTypes,
} from '../../components/ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import {
    lockedSelectorActionTypes,
} from '../../components/LockedSelector';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.actions';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import { scopeSelectorActionTypes } from '../../components/ScopeSelector';
import { actionTypes as initActionTypes } from '../../init/init.actions';

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
    [viewEventActionTypes.START_GO_BACK_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.page = null;
        newState.locationSwitchInProgress = true;
        return newState;
    },
    [enrollmentPageActionTypes.PAGE_OPEN]: (state) => {
        const newState = { ...state };
        newState.page = 'enrollment';
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
    [setCurrentSelectionsActionTypes.RESET_LOCATION_CHANGE]: (state) => {
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
    [lockedSelectorActionTypes.FROM_URL_UPDATE]: (state, action) => ({
        ...state,
        page: action.payload.nextPage,
    }),
    [newPageActionTypes.NEW_PAGE_OPEN]: state => ({
        ...state,
        locationSwitchInProgress: false,
        page: 'new',
    }),
    [searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE]: state => ({
        ...state,
        page: null,
        locationSwitchInProgress: true,
    }),
    [searchPageActionTypes.SEARCH_PAGE_OPEN]: state => ({
        ...state,
        locationSwitchInProgress: false,
        page: 'search',
    }),
    [scopeSelectorActionTypes.RESET_ORG_UNIT_ID]: (state, action) => ({
        ...state,
        previousOrgUnitId: action.payload.previousOrgUnitId,
    }),
    [initActionTypes.SET_CURRENT_ORG_UNIT_ROOT]: (state, action) => ({
        ...state,
        roots: action.payload.roots,
    }),
}, 'app');
