// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as mainPageSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { actionTypes as setOrgUnitActionTypes } from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    dataEntryUrlActionTypes as newEventDataEntryUrlActionTypes,
    selectorActionTypes as newEventSelectorActionTypes,
} from '../../components/Pages/NewEvent';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../components/Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as editEventPageSelectorActionTypes,
} from '../../components/Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import { orgUnitListActionTypes } from '../../components/QuickSelector';
import { set as setStoreRoots } from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

export const organisationUnitDesc = createReducerDescription({
    [editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [mainPageSelectionsActionTypes.ORG_UNIT_DATA_RETRIVED]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [mainPageSelectionsActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [newEventDataEntryUrlActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [setOrgUnitActionTypes.STORE_ORG_UNIT_OBJECT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [mainPageSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [newEventSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
}, 'organisationUnits');

const removeSearchDataOnResetRegUnit = (state) => {
    setStoreRoots('regUnit', { searchRoots: null });
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
        setStoreRoots('regUnit', { searchRoots: null });
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
    [mainPageSelectorActionTypes.RESET_ORG_UNIT_ID]: removeSearchDataOnResetRegUnit,
    [mainPageSelectionsActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: removeSearchDataOnResetRegUnit,
    [newEventSelectorActionTypes.RESET_ORG_UNIT_ID]: removeSearchDataOnResetRegUnit,
    [newEventDataEntryUrlActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: removeSearchDataOnResetRegUnit,
    [editEventPageSelectorActionTypes.RESET_ORG_UNIT_ID]: removeSearchDataOnResetRegUnit,
}, 'registeringUnitList');
