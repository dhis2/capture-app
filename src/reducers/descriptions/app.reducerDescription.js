// @flow
/* eslint-disable import/prefer-default-export */
import { createReducerDescription } from 'capture-core/tracker-redux/trackerReducer';
import { actionTypes as entryActionTypes } from '../../init/entry.actions';

export const appReducerDesc = createReducerDescription({
    [entryActionTypes.STARTUP_DATA_LOADED]: (state, action) => {
        const newState = { ...state };
        newState.someRandomData = action.payload;
        newState.ready = true;
        return newState;
    },
}, 'app');
