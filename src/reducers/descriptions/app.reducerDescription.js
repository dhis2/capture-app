// @flow
import { getAppReducerDesc } from 'capture-core/reducers/descriptions/app.reducerDescriptionGetter';
import { appStartActionTypes } from '../../components/AppStart';

export const appReducerDesc = getAppReducerDesc({
    [appStartActionTypes.APP_LOAD]: state => ({
        ...state,
        initDone: false,
        page: '',
    }),
    [appStartActionTypes.APP_LOAD_SUCESS]: (state) => {
        const newState = { ...state };
        newState.initDone = true;
        return newState;
    },
    [appStartActionTypes.APP_LOAD_FAILED]: (state, action) => {
        const { error } = action.payload;
        return {
            ...state,
            initDone: true,
            error,
        };
    },
});
