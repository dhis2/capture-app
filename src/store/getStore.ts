import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableBatching } from 'redux-batched-actions';
import { createLogger } from 'redux-logger';
import { buildReducersFromDescriptions } from 'capture-core/trackerRedux/trackerReducer';
import { environments } from 'capture-core/constants/environments';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { getEffectReconciler, shouldDiscard, queueConfig } from 'capture-core/trackerOffline';
import { getPersistOptions } from './persist/persistOptionsGetter';
import { reducerDescriptions } from '../reducers/descriptions/trackerCapture.reducerDescriptions';
import { epics } from '../epics/trackerCapture.epics';

export async function getStore(
    navigate: (path: string, scrollToTop?: boolean) => void,
    apiUtils: any,
    onRehydrated: () => void) {
    const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

    const rootReducer = combineReducers({
        ...reducersFromDescriptions,
    });

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
        persistOptions: await getPersistOptions(),
    });

    const epicMiddleware = createEpicMiddleware({
        dependencies: { ...apiUtils, navigate },
    });

    const middleware = [epicMiddleware, offlineMiddleware];

    if (process.env.NODE_ENV !== environments.prod) {
        middleware.push(createLogger({ collapsed: true, diff: true }));
    }

    const store = createStore(
        enableBatching(offlineEnhanceReducer(rootReducer)),
        composeWithDevTools(
            (offlineEnhanceStore as any)(applyMiddleware(...middleware)),
        ),
    );

    epicMiddleware.run(epics as any);

    return store;
}
