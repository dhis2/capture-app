// @flow
import isDefined from 'd2-utilizr/lib/isDefined';
import isArray from 'd2-utilizr/lib/isArray';
import log from 'loglevel';
import type { Reducer } from 'redux';

import environments from '../constants/environments';

type Action = {
    type: string,
    [props: string]: any
}

type ActionOnReducerData = (state: any, action: Action) => void;

type ReducerWrapper = (reducer: Reducer<any, Action>) => Reducer<any, Action>;

type ReducerDescription = {
    initValue: any,
    name: string,
    updaters: Object,
    reducerWrappers: ?ReducerWrapper | Array<ReducerWrapper>
};

type Updater = (state: ReduxState, action: Action) => ReduxState;
export type Updaters = { [type: string]: Updater };

function updateStatePartInProduction<T>(
    state: ?T,
    action: Action,
    updatersForActionTypes: {[actionType: string]: () => T},
    initValue: T): T {
    if (!isDefined(state) || state === null) {
        state = initValue;
    }

    if (updatersForActionTypes[action.type]) {
        // $FlowSuppress
        // $FlowFixMe[extra-arg] automated comment
        const newState = updatersForActionTypes[action.type](state, action);
        return newState;
    }

    // $FlowSuppress
    // $FlowFixMe[incompatible-return] automated comment
    return state;
}

function updateStatePartInDevelopment<T>(
    state: ?T,
    action: Action,
    updatersForActionTypes: {[actionType: string]: () => T},
    initValue: T,
    onUpdaterFound: ActionOnReducerData,
    onUpdaterExecuted: ActionOnReducerData): T {
    if (!isDefined(state) || state === null) {
        state = initValue;
    }

    if (updatersForActionTypes[action.type]) {
        onUpdaterFound(state, action);
        // $FlowSuppress
        // $FlowFixMe[extra-arg] automated comment
        const newState = updatersForActionTypes[action.type](state, action);
        onUpdaterExecuted(state, action);
        return newState;
    }

    // $FlowSuppress
    // $FlowFixMe[incompatible-return] automated comment
    return state;
}

const getUpdaterFoundFn =
    (reducerDescription: ReducerDescription) =>
        (state: any, action: Action) => {
            log.trace(
                `Updater for ${action.type} started in ${reducerDescription.name}. 
                Starting state is: ${JSON.stringify(state)}`,
            );
        };

const getUpdaterExecutedFn =
    (reducerDescription: ReducerDescription) =>
        (state: any, action: Action) => {
            log.trace(
                `Updater for ${action.type} executed in ${reducerDescription.name}. 
                New state is: ${JSON.stringify(state)}`);
        };

const getProductionReducer =
    (reducerDescription: ReducerDescription) =>
        (state: any, action: Action) =>
            updateStatePartInProduction(state, action, reducerDescription.updaters, reducerDescription.initValue);

const createLogAction = (action: Action) => {
    const payloadOverride = action.meta && action.meta.skipLogging && action.meta.skipLogging.reduce((accSkipLogging, item) => {
        accSkipLogging[item] = null;
        return accSkipLogging;
    }, {});

    return { ...action, payload: { ...action.payload, ...payloadOverride } };
};


const getDevelopmentReducer = (reducerDescription: ReducerDescription) => {
    const updaterFoundFn = getUpdaterFoundFn(reducerDescription);
    const updaterExecutedFn = getUpdaterExecutedFn(reducerDescription);
    return (state: any, action: Action) => {
        const logAction = createLogAction(action);
        log.trace(`reducer ${reducerDescription.name} starting. Action is: ${JSON.stringify(logAction)}`);
        const newState =
            updateStatePartInDevelopment(
                state,
                action,
                reducerDescription.updaters,
                reducerDescription.initValue,
                updaterFoundFn,
                updaterExecutedFn,
            );
        log.trace(`reducer ${reducerDescription.name} finished`);
        return newState;
    };
};

function wrapReducers(reducer: Reducer<any, Action>, reducerWrappers: ReducerWrapper | Array<ReducerWrapper>) {
    if (isArray(reducerWrappers)) {
        // $FlowFixMe[prop-missing] automated comment
        return reducerWrappers.reduceRight((prevReducer, currentReducer) => currentReducer(prevReducer), reducer);
    }

    // $FlowSuppress
    // $FlowFixMe[not-a-function] automated comment
    return reducerWrappers(reducer);
}

function buildReducer(reducerDescription: ReducerDescription) {
    const currentEnvironment = process && process.env && process.env.NODE_ENV && process.env.NODE_ENV;

    let reducer = currentEnvironment === environments.prod
        ? getProductionReducer(reducerDescription)
        : getDevelopmentReducer(reducerDescription);

    if (reducerDescription.reducerWrappers) {
        reducer = wrapReducers(reducer, reducerDescription.reducerWrappers);
    }

    return reducer;
}

export function buildReducersFromDescriptions(reducerDescriptions: Array<ReducerDescription>) {
    // $FlowSuppress
    const reducers = reducerDescriptions
        // $FlowSuppress
        .reduce((accReducers: {[reducerName: string]: Reducer<any, Action>}, description: ReducerDescription) => {
            accReducers[description.name] = buildReducer(description);
            return accReducers;
        }, {});
    return reducers;
}

export function createReducerDescription(
    updaters: Updaters,
    name: string,
    initValue: any = {},
    reducerWrappers?: ?ReducerWrapper | Array<ReducerWrapper>): ReducerDescription {
    return {
        initValue,
        name,
        updaters,
        reducerWrappers,
    };
}
