import { getAppReducerDesc } from 'capture-core/reducers/descriptions/app.reducerDescriptionGetter';
import { appStartActionTypes } from '../../components/AppStart';

type AppState = {
    initDone: boolean;
    page: string;
    error?: unknown;
};

type AppAction = {
    type: string;
    payload?: {
        error: unknown;
    };
};

export const appReducerDesc = getAppReducerDesc({
    [appStartActionTypes.APP_LOAD]: (state: AppState) => ({
        ...state,
        initDone: false,
        page: '',
    }),
    [appStartActionTypes.APP_LOAD_SUCESS]: (state: AppState) => {
        const newState = { ...state };
        newState.initDone = true;
        return newState;
    },
    [appStartActionTypes.APP_LOAD_FAILED]: (state: AppState, action: AppAction) => {
        const { error } = action.payload ?? {};
        return {
            ...state,
            initDone: true,
            error,
        };
    },
});
