// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
  CORE_LOAD: 'CoreLoad',
  CORE_LOAD_SUCCESS: 'CoreLoadSucess',
  CORE_LOAD_FAILED: 'CoreLoadFailed',
  ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS: 'OrgUnitCaptureRootsLoadSuccess',
  ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS: 'OrgUnitSearchRootsLoadSuccess',
};

export const loadCore = () => actionCreator(actionTypes.CORE_LOAD)();
export const loadCoreSuccess = () => actionCreator(actionTypes.CORE_LOAD_SUCCESS)();
export const loadCoreFailed = (error: any) =>
  actionCreator(actionTypes.CORE_LOAD_FAILED)({ error });
export const loadOrgUnitCaptureRootsSuccess = (roots: Array<any>) =>
  actionCreator(actionTypes.ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS)({ roots });
export const loadOrgUnitSearchRootsSuccess = (roots: Array<any>) =>
  actionCreator(actionTypes.ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS)({ roots });
