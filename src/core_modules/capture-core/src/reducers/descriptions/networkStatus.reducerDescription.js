// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

export const networkStatusDesc = createReducerDescription({
    'FLIP_IT': (state, action) => {
        const newState = { ...state };
        if (!action.payload.status) {
            console.log('going offline')
            newState.offlineSince = Date.now();
        } else {
            console.log('going online')
            newState.offlineSince = 0;
        }
        return newState;
    },
}, 'networkStatus', {});
