// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { actionTypes as setOrgUnitActionTypes } from '../../components/LockedSelector/QuickSelector/actions/QuickSelector.actions';
import { urlActionTypes as newEnrollmentUrlActionTypes } from '../../components/Pages/NewEnrollment';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/LockedSelector.actions';
import { orgUnitListActionTypes } from '../../components/LockedSelector/QuickSelector';
import { set as setStoreRoots } from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { actionTypes as initActionTypes } from '../../init/init.actions';

export const organisationUnitDesc = createReducerDescription({
    [editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [newEnrollmentUrlActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => ({
        ...state,
        [action.payload.orgUnit.id]: action.payload.orgUnit,
    }),
    [setOrgUnitActionTypes.STORE_ORG_UNIT_OBJECT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },

    [lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_SET]: (state, action) => ({
        ...state,
        [action.payload.id]: action.payload,
    }),
    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: (state, action) => ({
        ...state,
        [action.payload.orgUnit.id]: action.payload.orgUnit,
    }),
}, 'organisationUnits');

export const organisationUnitRootsDesc = createReducerDescription({
    [initActionTypes.ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS]: (state, action) => ({
        ...state,
        searchRoots: {
            roots: action.payload.roots,
        },
    }),
    [initActionTypes.ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS]: (state, action) => ({
        ...state,
        captureRoots: {
            roots: action.payload.roots,
        },
    }),
}, 'organisationUnitRoots');

const removeSearchDataOnResetRegUnit = (state) => {
    setStoreRoots('regUnit', null);
    return {
        ...state,
        searchRoots: null,
        searchText: null,
        key: 'reset_reg_units',
    };
};

export const registeringUnitListDesc = createReducerDescription({
    [orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS]: (state, action) => ({
        searchRoots: null,
        searchText: null,
        userRoots: action.payload.roots,
        key: 'user_init',
    }),
    [orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS_FAILED]: () => ({
        searchRoots: null,
        searchText: null,
        userRoots: null,
        key: 'user_init_failed',
    }),
    [orgUnitListActionTypes.SEARCH_ORG_UNITS]: (state, action) => ({
        ...state,
        searchText: action.payload.searchText,
    }),
    [orgUnitListActionTypes.CLEAR_ORG_UNIT_SEARCH]: (state) => {
        setStoreRoots('regUnit', null);
        return {
            ...state,
            searchText: null,
            searchRoots: null,
            key: 'clear',
        };
    },
    [orgUnitListActionTypes.SET_SEARCH_ROOTS]: (state, action) => ({
        ...state,
        ...action.payload,
        isLoading: false,
        key: action.payload.searchText,
    }),
    [orgUnitListActionTypes.SET_SEARCH_ROOTS_FAILED]: (state, action) => ({
        ...state,
        searchRoots: [],
        isLoading: false,
        key: action.payload.searchText,
    }),
    [orgUnitListActionTypes.SHOW_LOADING_INDICATOR]: state => ({
        ...state,
        isLoading: true,
    }),
    [lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_EMPTY_SET]: removeSearchDataOnResetRegUnit,
    [lockedSelectorActionTypes.ORG_UNIT_ID_RESET]: removeSearchDataOnResetRegUnit,
    [newEnrollmentUrlActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: removeSearchDataOnResetRegUnit,
}, 'registeringUnitList');
