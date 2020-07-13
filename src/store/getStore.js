// @flow
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';
import type { BrowserHistory } from 'history/createBrowserHistory';
import type { HashHistory } from 'history/createHashHistory';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { effectConfig, discardConfig, queueConfig } from 'capture-core/trackerOffline/trackerOfflineConfig';
import getPersistOptions from './persist/persistOptionsGetter';
import reducerDescriptions from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from '../epics/trackerCapture.epics';


export function getStore(history: BrowserHistory | HashHistory, onRehydrated: () => void) {
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
        discard: discardConfig,
        effect: effectConfig,
        persistCallback: onRehydrated,
        queue: queueConfig,
        persistOptions: getPersistOptions(),
    });

    const epicMiddleware = createEpicMiddleware({
        dependencies: {},
    });

    const middleware = [epicMiddleware, routerMiddleware(history), offlineMiddleware];

    if (process.env.NODE_ENV !== environments.prod) {
        middleware.push(createLogger({}));
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
