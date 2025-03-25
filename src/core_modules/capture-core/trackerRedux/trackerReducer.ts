import isDefined from 'd2-utilizr/lib/isDefined';
import isArray from 'd2-utilizr/lib/isArray';
import log from 'loglevel';
import { Reducer } from 'redux';

import { environments } from '../constants/environments';

type Action = {
    type: string;
    [key: string]: any;
};

type ActionOnReducerData = (state: any, action: Action) => void;

type ReducerWrapper = (reducer: Reducer<any, Action>) => Reducer<any, Action>;

type ReducerDescription = {
    initValue: unknown;
    name: string;
    updaters: Record<string, Updater>;
    reducerWrappers?: ReducerWrapper | ReducerWrapper[];
};

type Updater = (state: unknown, action: Action) => unknown;
export type Updaters = Record<string, Updater>;

function updateStatePartInProduction<T extends unknown>(
    state: T | null | undefined,
    action: Action,
    updatersForActionTypes: Record<string, (state: T, action: Action) => T>,
    initValue: T
): T {
    if (!isDefined(state) || state === null) {
        state = initValue;
    }

    if (updatersForActionTypes[action.type]) {
        const newState = updatersForActionTypes[action.type](state, action);
        return newState;
    }

    return state;
}

function updateStatePartInDevelopment<T>(
    state: T | null | undefined,
    action: Action,
    updatersForActionTypes: Record<string, (state: T, action: Action) => T>,
    initValue: T,
    onUpdaterFound: ActionOnReducerData,
    onUpdaterExecuted: ActionOnReducerData
): T {
    if (!isDefined(state) || state === null) {
        state = initValue;
    }

    if (updatersForActionTypes[action.type]) {
        onUpdaterFound(state, action);

        const newState = updatersForActionTypes[action.type](state, action);
        onUpdaterExecuted(state, action);
        return newState;
    }

    return state;
}

const getUpdaterFoundFn =
    (reducerDescription: ReducerDescription) =>
        (state: unknown, action: Action) => {
            log.trace(
                `Updater for ${action.type} started in ${reducerDescription.name}. 
                Starting state is: ${JSON.stringify(state)}`
            );
        };

const getUpdaterExecutedFn =
    (reducerDescription: ReducerDescription) =>
        (state: unknown, action: Action) => {
            log.trace(
                `Updater for ${action.type} executed in ${reducerDescription.name}. 
                New state is: ${JSON.stringify(state)}`
            );
        };

const getProductionReducer =
    (reducerDescription: ReducerDescription) =>
        (state: unknown, action: Action) =>
            updateStatePartInProduction(state, action, reducerDescription.updaters, reducerDescription.initValue);

const createLogAction = (action: Action) => {
    const payloadOverride = action.meta && action.meta.skipLogging && action.meta.skipLogging.reduce((accSkipLogging, item) => {
        accSkipLogging[item] = null;
        return accSkipLogging;
    }, {} as Record<string, null>);

    return { ...action, payload: { ...action.payload, ...payloadOverride } };
};

const getDevelopmentReducer = (reducerDescription: ReducerDescription) => {
    const updaterFoundFn = getUpdaterFoundFn(reducerDescription);
    const updaterExecutedFn = getUpdaterExecutedFn(reducerDescription);
    return (state: unknown, action: Action) => {
        const logAction = createLogAction(action);
        log.trace(`reducer ${reducerDescription.name} starting. Action is: ${JSON.stringify(logAction)}`);
        const newState =
            updateStatePartInDevelopment(
                state,
                action,
                reducerDescription.updaters,
                reducerDescription.initValue,
                updaterFoundFn,
                updaterExecutedFn
            );
        log.trace(`reducer ${reducerDescription.name} finished`);
        return newState;
    };
};

function wrapReducers(reducer: Reducer<unknown, Action>, reducerWrappers: ReducerWrapper | ReducerWrapper[]) {
    if (isArray(reducerWrappers)) {
        return reducerWrappers.reduceRight((prevReducer, currentReducer) => currentReducer(prevReducer), reducer);
    }

    return reducerWrappers(reducer);
}

function buildReducer(reducerDescription: ReducerDescription) {
    let reducer = process.env.NODE_ENV === environments.prod
        ? getProductionReducer(reducerDescription)
        : getDevelopmentReducer(reducerDescription);

    if (reducerDescription.reducerWrappers) {
        reducer = wrapReducers(reducer, reducerDescription.reducerWrappers);
    }

    return reducer;
}

export function buildReducersFromDescriptions(reducerDescriptions: ReducerDescription[]) {
    const reducers = reducerDescriptions
        .reduce((accReducers: Record<string, Reducer<unknown, Action>>, description: ReducerDescription) => {
            accReducers[description.name] = buildReducer(description);
            return accReducers;
        }, {});
    return reducers;
}

export function createReducerDescription(
    updaters: Updaters,
    name: string,
    initValue: unknown = {},
    reducerWrappers?: ReducerWrapper | ReducerWrapper[]
): ReducerDescription {
    return {
        initValue,
        name,
        updaters,
        reducerWrappers
    };
}
