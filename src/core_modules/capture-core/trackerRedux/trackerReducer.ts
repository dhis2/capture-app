import type { Reducer } from 'redux';
import { batchActions } from 'redux-batched-actions';

type Action = {
    type: string;
    payload?: any;
    meta?: any;
    error?: any;
    [props: string]: any;
};

type ReducerWrapper = {
    reducerName: string;
    reducerFunc: Reducer<any, any>;
    reducerWrappers?: ReducerWrapper | Array<ReducerWrapper>;
};

type Updater = (state: any, action: any) => any;
export type Updaters = { [type: string]: Updater };

function updateStatePartInProduction<T>(
    state: T,
    updater: (currentState: T) => T,
): T {
    return updater(state);
}

function updateStatePartInDevelopment<T>(
    state: T,
    updater: (currentState: T) => T,
): T {
    return updater(state);
}

const updateStatePart = process.env.NODE_ENV === 'production' ? updateStatePartInProduction : updateStatePartInDevelopment;

export function createReducerDescription(
    updaters: Updaters,
    reducerName: string,
    initialState?: any,
    reducerWrappers?: ReducerWrapper | Array<ReducerWrapper>,
): Reducer<any, any> {
    const onDefault = initialState ? () => initialState : undefined;
    return createReducer(updaters, onDefault, reducerWrappers);
}

function getWrappedReducer(
    reducerWrapper: ReducerWrapper,
    mainReducer: Reducer<any, any>,
): Reducer<any, any> {
    const { reducerFunc, reducerWrappers } = reducerWrapper;

    if (!reducerWrappers) {
        return reducerFunc(mainReducer, undefined);
    }

    if (Array.isArray(reducerWrappers)) {
        return reducerWrappers
            .reduce((accReducer, currentReducerWrapper) => getWrappedReducer(currentReducerWrapper, accReducer), mainReducer);
    }

    return getWrappedReducer(reducerWrappers, reducerFunc(mainReducer, undefined));
}

export function createReducer(
    updaters: Updaters,
    onDefault?: (state: any, action: Action) => any,
    reducerWrappers?: ReducerWrapper | Array<ReducerWrapper>,
): Reducer<any, any> {
    const mainReducer = (state: any = {}, action: Action) => {
        if (action.type === (batchActions as any).type) {
            return action.payload.reduce((accState, currentAction) => mainReducer(accState, currentAction), state);
        }

        const updater = updaters[action.type];
        if (updater) {
            return updateStatePart(state, currentState => updater(currentState, action));
        }

        if (onDefault) {
            return onDefault(state, action);
        }

        return state;
    };

    if (!reducerWrappers) {
        return mainReducer;
    }

    if (Array.isArray(reducerWrappers)) {
        return reducerWrappers
            .reduce((accReducer, currentReducerWrapper) => getWrappedReducer(currentReducerWrapper, accReducer), mainReducer);
    }

    return getWrappedReducer(reducerWrappers, mainReducer);
}
