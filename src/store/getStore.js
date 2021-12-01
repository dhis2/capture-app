// @flow
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import type { BrowserHistory, HashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import { getEffectReconciler, shouldDiscard, queueConfig } from 'capture-core/trackerOffline';
import { environments } from 'capture-core/constants/environments';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { createOffline } from '@redux-offline/redux-offline';

import { reducerDescriptions } from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import { epics } from '../epics/trackerCapture.epics';
import { getPersistOptions } from './persist/persistOptionsGetter';

export function getStore(
    history: BrowserHistory | HashHistory,
    apiUtils: ApiUtils,
    onRehydrated: () => void) {
    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        ...reducersFromDescriptions,
        router: connectRouter(history),
    });

    // https://github.com/redux-offline/redux-offline/blob/32e4c98ec782672347b42a7936631df5c6340b77/docs/api/config.md
    const {
        middleware: offlineMiddleware,
        enhanceReducer: offlineEnhanceReducer,
        enhanceStore: offlineEnhanceStore,
    } = createOffline({
        ...offlineConfig,
        discard: shouldDiscard,
        effect: getEffectReconciler(apiUtils.mutate),
        persistCallback: onRehydrated,
        queue: queueConfig,
        persistOptions: getPersistOptions(),
    });

    apiUtils.history = history;
    const epicMiddleware = createEpicMiddleware({
        dependencies: apiUtils,
    });

    const middleware = [epicMiddleware, routerMiddleware(history), offlineMiddleware];

    if (process.env.NODE_ENV !== environments.prod) {
        middleware.push(createLogger({ collapsed: true, diff: true }));
    }

    // $FlowFixMe[missing-annot] automated comment
    const store = createStore(
        enableBatching(offlineEnhanceReducer(rootReducer)),
        composeWithDevTools(
            compose(offlineEnhanceStore, applyMiddleware(...middleware)),
        ),
    );

    epicMiddleware.run(epics);

    return store;
}
