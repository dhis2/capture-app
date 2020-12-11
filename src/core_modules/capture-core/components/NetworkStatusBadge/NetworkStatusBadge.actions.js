// @flow

import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
  NETWORK_STATUS_CHANGE: 'NetworkStatusChange',
};

export const networkStatusChange = (status: boolean) =>
  actionCreator(actionTypes.NETWORK_STATUS_CHANGE)({ status });
