// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const orgUnitListActionTypes = {
    INIT_REG_UNIT_LIST_ROOTS: 'initRegUnitListRoots',
    INIT_REG_UNIT_LIST_ROOTS_FAILED: 'initRegUnitListRootsFailed',
    SEARCH_ORG_UNITS: 'searchRegisteringUnits',
    CLEAR_ORG_UNIT_SEARCH: 'clearOrgUnitSearch',
    SET_SEARCH_ROOTS: 'setRegisteringUnitSearchRoots',
    SET_SEARCH_ROOTS_FAILED: 'setSearchRootsFailed',
    SHOW_LOADING_INDICATOR: 'showRegUnitLoadingIndicator',
};

export const initRegUnitListRoots = (roots: any) =>
    actionCreator(orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS)({ roots });

export const initRegUnitListRootsFailed = (message: string) =>
    actionCreator(orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS_FAILED)({ message });

export const searchOrgUnits = (searchText: string) =>
    actionCreator(orgUnitListActionTypes.SEARCH_ORG_UNITS)({ searchText });

export const setSearchRootsFailed = (message: string) =>
    actionCreator(orgUnitListActionTypes.SET_SEARCH_ROOTS_FAILED)({ message });

export const clearOrgUnitsSearch = () =>
    actionCreator(orgUnitListActionTypes.CLEAR_ORG_UNIT_SEARCH)();

export const setSearchRoots = (roots: Array<Object>, searchText: string) =>
    actionCreator(orgUnitListActionTypes.SET_SEARCH_ROOTS)({ roots, searchText });

export const showLoadingIndicator = () =>
    actionCreator(orgUnitListActionTypes.SHOW_LOADING_INDICATOR)();
