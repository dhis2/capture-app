// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT_SEARCH_ROOTS: 'SetOrgUnitSearchRoots',
    SET_ORG_UNIT_CAPTURE_ROOTS: 'SetOrgUnitCaptureRoots',
    SET_ORG_UNIT_FILTERED_ROOTS: 'SetOrgUnitFilteredRoots',
    LOAD_ORG_UNIT_SEARCH_ROOTS_FAILED: 'LoadOrgUnitSearchRootsFailed',
    LOAD_ORG_UNIT_CAPTURE_ROOTS_FAILED: 'LoadOrgUnitCaptureRootsFailed',
    REQUEST_FILTER_ORG_UNIT_ROOTS: 'RequestFilterOrgUnitRoots',
    FILTER_ORG_UNIT_ROOTS_FAILED: 'FilterOrgUnitRootsFailed',
    FILTERED_ORG_UNIT_ROOTS_RETRIEVED: 'FilteredOrgUnitRootsRetrieved',
    CLEAR_ORG_UNIT_ROOTS: 'ClearOrgUnitRoots',

};

export const loadOrgUnitCaptureRootsFailed = (error: any) =>
    actionCreator(actionTypes.LOAD_ORG_UNIT_CAPTURE_ROOTS_FAILED)({ error });

export const loadOrgUnitSearchRootsFailed = (error: any) =>
    actionCreator(actionTypes.LOAD_ORG_UNIT_SEARCH_ROOTS_FAILED)({ error });

export const setOrgUnitSearchRoots = (roots: any) =>
    actionCreator(actionTypes.SET_ORG_UNIT_SEARCH_ROOTS)({ roots });

export const setOrgUnitCaptureRoots = (roots: any) =>
    actionCreator(actionTypes.SET_ORG_UNIT_CAPTURE_ROOTS)({ roots });

export const requestFilterOrgUnitRoots = (key: string, searchText: string, parameters?: ?Object) =>
    actionCreator(actionTypes.REQUEST_FILTER_ORG_UNIT_ROOTS)({ key, searchText, parameters });

export const filteredOrgUnitRootsRetrieved = (key: string, filteredRoots: any) =>
    actionCreator(actionTypes.FILTERED_ORG_UNIT_ROOTS_RETRIEVED)({ key, filteredRoots });

export const filterOrgUnitRootsFailed = (key: string, error: any) =>
    actionCreator(actionTypes.FILTER_ORG_UNIT_ROOTS_FAILED)({ key, error });

export const clearOrgUnitRoots = (key: string) =>
    actionCreator(actionTypes.CLEAR_ORG_UNIT_ROOTS)({ key });
