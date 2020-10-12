// @flow
import { configureStore as toolkitConfigureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';
import type { BrowserHistory } from 'history/createBrowserHistory';
import type { HashHistory } from 'history/createHashHistory';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { getEffectReconciler, shouldDiscard, queueConfig } from 'capture-core/trackerOffline';
import getPersistOptions from './persist/persistOptionsGetter';
import reducerDescriptions from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from '../epics/trackerCapture.epics';
import { searchPage } from '../core_modules/capture-core/reducers/descriptions/searchPage.reducerDescription';

export function getStore(
    history: BrowserHistory | HashHistory,
    onApiMutate: Function,
    onRehydrated: () => void) {
    const rootReducer = combineReducers({
        ...buildReducersFromDescriptions(reducerDescriptions),
        searchPage,
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
        effect: getEffectReconciler(onApiMutate),
        persistCallback: onRehydrated,
        queue: queueConfig,
        persistOptions: getPersistOptions(),
    });

    const [, immutableStateInvariant, serializableStateInvariant] = getDefaultMiddleware();
    const router = routerMiddleware(history);
    const epicMiddleware = createEpicMiddleware();
    const middleware = [immutableStateInvariant, serializableStateInvariant, epicMiddleware, router, offlineMiddleware];

    if (process.env.NODE_ENV !== environments.prod) {
        middleware.push(createLogger({}));
    }


    const store = toolkitConfigureStore({
        reducer: enableBatching(offlineEnhanceReducer(rootReducer)),
        middleware,
        devTools: true,
        enhancers: defaultEnhancers => [offlineEnhanceStore, ...defaultEnhancers],
    });

    // this line needs to be executed after the configuration of the store.
    epicMiddleware.run(epics);

    return store;
}
