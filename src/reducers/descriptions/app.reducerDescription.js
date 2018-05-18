// @flow
import { getAppReducerDesc } from 'capture-core/reducers/descriptions/app.reducerDescriptionGetter';
import { actionTypes as entryActionTypes } from '../../init/entry.actions';

export const appReducerDesc = getAppReducerDesc({
    [entryActionTypes.STARTUP_DATA_LOADED]: (state, action) => {
        const newState = { ...state };
        newState.someRandomData = action.payload;
        newState.initDone = true;
        return newState;
    },
});
