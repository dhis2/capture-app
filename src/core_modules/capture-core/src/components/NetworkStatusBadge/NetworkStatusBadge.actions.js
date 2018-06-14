import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    NETWORK_STATUS_CHANGE: 'NetworkStatusChange',
};

export const networkStatusChange =
    (status: Boolean) => actionCreator(actionTypes.NETWORK_STATUS_CHANGE)({status});
