// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT_SEARCH_ROOTS: 'SetOrgUnitSearchRoots',
    SET_ORG_UNIT_CAPTURE_ROOTS: 'SetOrgUnitCaptureRoots',
    LOAD_ORG_UNIT_SEARCH_ROOTS_FAILED: 'LoadOrgUnitSearchRootsFailed',
    LOAD_ORG_UNIT_CAPTURE_ROOTS_FAILED: 'LoadOrgUnitCaptureRootsFailed',

};

export const loadOrgUnitCaptureRootsFailed = (error: any) =>
    actionCreator(actionTypes.LOAD_ORG_UNIT_CAPTURE_ROOTS_FAILED)({ error });

export const loadOrgUnitSearchRootsFailed = (error: any) =>
    actionCreator(actionTypes.LOAD_ORG_UNIT_SEARCH_ROOTS_FAILED)({ error });

export const setOrgUnitSearchRoots = (roots: any) =>
    actionCreator(actionTypes.SET_ORG_UNIT_SEARCH_ROOTS)({ roots });

export const setOrgUnitCaptureRoots = (roots: any) =>
    actionCreator(actionTypes.SET_ORG_UNIT_CAPTURE_ROOTS)({ roots });
