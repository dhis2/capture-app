// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    CORE_LOAD: 'CoreLoad',
    ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS: 'OrgUnitCaptureRootsLoadSuccess',
    ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS: 'OrgUnitSearchRootsLoadSuccess',
    SET_CURRENT_ORG_UNIT_ROOT: 'SetCurrentOrgUnitRoot',
};

export const loadCore = () => actionCreator(actionTypes.CORE_LOAD)();
export const loadOrgUnitCaptureRootsSuccess =
    (roots: Array<any>) =>
        actionCreator(actionTypes.ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS)({ roots });
export const loadOrgUnitSearchRootsSuccess =
    (roots: Array<any>) =>
        actionCreator(actionTypes.ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS)({ roots });
export const setOrgUnitRoot = (roots: any) => actionCreator(actionTypes.SET_CURRENT_ORG_UNIT_ROOT)({ roots });
