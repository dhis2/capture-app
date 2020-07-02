// @flow
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import type { BrowserHistory } from 'history/createBrowserHistory';
import type { HashHistory } from 'history/createHashHistory';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';
import { effectConfig, discardConfig, queueConfig } from 'capture-core/trackerOffline/trackerOfflineConfig';
import getPersistOptions from './persist/persistOptionsGetter';
import reducerDescriptions from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from '../epics/trackerCapture.epics';


export default function getStore(history: BrowserHistory | HashHistory, onRehydrated: () => void) {
    const middleWares = [createEpicMiddleware(epics), routerMiddleware(history)];

    if (process.env.NODE_ENV !== environments.prod) {
        middleWares.push(
            createLogger({ }),
        );
    }

    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        ...reducersFromDescriptions,
        router: connectRouter(history),
    });

    const {
        middleware: offlineMiddleware,
        enhanceReducer: offlineEnhanceReducer,
        enhanceStore: offlineEnhanceStore,
    } = createOffline({
        ...offlineConfig,
        discard: discardConfig,
        effect: effectConfig,
        persistCallback: onRehydrated,
        queue: queueConfig,
        persistOptions: getPersistOptions(),
    });

    return createStore(
        enableBatching(offlineEnhanceReducer(rootReducer)), composeWithDevTools(
            compose(
                offlineEnhanceStore,
                applyMiddleware(
                    ...middleWares,
                    offlineMiddleware,
                ),
            ),
        ),
    );
}
