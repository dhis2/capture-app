// @flow
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';

import reduxOptimisticUI from 'capture-core/middleware/reduxOptimisticUI/reduxOptimisticUI.middleware';
import rulesEngine from 'capture-core/middleware/rulesEngine/rulesEngine.middleware';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import environments from 'capture-core/constants/environments';

import reducerDescriptions from './reducers/descriptions/trackerCapture.reducerDescriptions';
import epics from './epics/trackerCapture.epics';

const middleWares = [createEpicMiddleware(epics), rulesEngine, reduxOptimisticUI];

if (process.env.NODE_ENV !== environments.prod) {
    middleWares.push(
        createLogger({ }),
    );
}

const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

const rootReducer = combineReducers({ ...reducersFromDescriptions });

export default createStore(enableBatching(rootReducer), composeWithDevTools(applyMiddleware(...middleWares)));
