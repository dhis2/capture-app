// @flow
import { getAppReducerDesc } from 'capture-core/reducers/descriptions/app.reducerDescriptionGetter';
import { actionTypes as entryActionTypes } from '../../entry';

export const appReducerDesc = getAppReducerDesc({
    [entryActionTypes.APP_LOAD]: state => ({
        ...state,
        initDone: false,
    }),
    [entryActionTypes.APP_LOAD_SUCESS]: (state, action) => {
        const newState = { ...state };
        newState.someRandomData = action.payload;
        newState.initDone = true;
        return newState;
    },
    [entryActionTypes.APP_LOAD_FAILED]: (state, action) => {
        const { error } = action.payload;
        return {
            ...state,
            initDone: true,
            error,
        };
    },
});
