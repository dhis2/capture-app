// @flow
import { actionTypes } from '../../components/NetworkStatusBadge/NetworkStatusBadge.actions';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

export const networkStatusDesc = createReducerDescription({
    [actionTypes.NETWORK_STATUS_CHANGE]: (state, action) => {
        const newState = { ...state };
        if (!action.payload.status) {
            newState.offlineSince = Date.now();
        } else {
            newState.offlineSince = 0;
        }
        return newState;
    },
}, 'networkStatus', {});
