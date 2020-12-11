// @flow
import { batchActions } from 'redux-batched-actions';
import { loadCoreSuccess } from './init.actions';

export const batchActionTypes = {
  CORE_LOAD_SUCCESS_BATCH: 'CoreLoadSuccessBatch',
};

export const loadCoreSuccessBatch = (orgUnitRootsActions: Array<ReduxAction<any, any>>) =>
  batchActions(
    [...orgUnitRootsActions, loadCoreSuccess()],
    batchActionTypes.CORE_LOAD_SUCCESS_BATCH,
  );
