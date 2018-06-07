// @flow
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import type { BrowserHistory } from 'history/createBrowserHistory';
import type { HashHistory } from 'history/createHashHistory';

import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { effectConfig } from 'capture-core/trackerOffline/trackerOfflineConfig';

import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';

import reducerDescriptions from './reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from './epics/trackerCapture.epics';


export default function getStore(history: BrowserHistory | HashHistory) {
    const middleWares = [createEpicMiddleware(epics), routerMiddleware(history)];

    if (process.env.NODE_ENV !== environments.prod) {
        middleWares.push(
            createLogger({ }),
        );
    }

    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        router: routerReducer,
        ...reducersFromDescriptions,
    });

    const {
        middleware: offlineMiddleware,
        enhanceReducer: offlineEnhanceReducer,
        enhanceStore: offlineEnhanceStore,
    } = createOffline({
        ...offlineConfig,
        effect: effectConfig,
    });

    return createStore(
        offlineEnhanceReducer(enableBatching(rootReducer)), composeWithDevTools(
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
