import { actionCreator } from '../actions/actions.utils';

export const actionTypes = {
    CORE_LOAD: 'CoreLoad',
    ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS: 'OrgUnitCaptureRootsLoadSuccess',
    ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS: 'OrgUnitSearchRootsLoadSuccess',
    SET_CURRENT_ORG_UNIT_ROOT: 'SetCurrentOrgUnitRoot',
};

export const loadCore = () => actionCreator(actionTypes.CORE_LOAD)();
export const loadOrgUnitCaptureRootsSuccess =
    (roots: Array<unknown>) =>
        actionCreator(actionTypes.ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS)({ roots });
export const loadOrgUnitSearchRootsSuccess =
    (roots: Array<unknown>) =>
        actionCreator(actionTypes.ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS)({ roots });
export const setOrgUnitRoot = (roots: unknown) => actionCreator(actionTypes.SET_CURRENT_ORG_UNIT_ROOT)({ roots });
