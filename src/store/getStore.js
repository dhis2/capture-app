// @flow
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import { environments } from 'capture-core/constants/environments';
import type { BrowserHistory, HashHistory } from 'history';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { getEffectReconciler, shouldDiscard, queueConfig } from 'capture-core/trackerOffline';
import { getPersistOptions } from './persist/persistOptionsGetter';
import { reducerDescriptions } from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import { epics } from '../epics/trackerCapture.epics';

export function getStore(
    history: BrowserHistory | HashHistory,
    apiUtils: ApiUtilsWithoutHistory,
    onRehydrated: () => void) {
    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        ...reducersFromDescriptions,
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

    const epicMiddleware = createEpicMiddleware({
        dependencies: { ...apiUtils, history },
    });

    const middleware = [epicMiddleware, offlineMiddleware];

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
