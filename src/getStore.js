// @flow
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import type { BrowserHistory } from 'history/createBrowserHistory';
import type { HashHistory } from 'history/createHashHistory';

import reduxOptimisticUI from 'capture-core/middleware/reduxOptimisticUI/reduxOptimisticUI.middleware';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';

import reducerDescriptions from './reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from './epics/trackerCapture.epics';


export default function getStore(history: BrowserHistory | HashHistory) {
    const middleWares = [createEpicMiddleware(epics), routerMiddleware(history), reduxOptimisticUI];

    if (process.env.NODE_ENV !== environments.prod) {
        middleWares.push(
            createLogger({ }),
        );
    }

    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        ...reducersFromDescriptions,
        router: routerReducer,
    });

    return createStore(enableBatching(rootReducer), composeWithDevTools(applyMiddleware(...middleWares)));
}
