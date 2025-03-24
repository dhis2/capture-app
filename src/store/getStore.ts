import { createStore, applyMiddleware, combineReducers, compose, Action, Store } from 'redux';
import { createEpicMiddleware, Epic } from 'redux-observable';
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

type NavigateFunction = (path: string, scrollToTop?: boolean) => void;

interface ApiUtilsWithoutHistory {
  mutate: unknown;
}

type RootAction = Action<any>;
type RootState = Record<string, unknown>;
type Dependencies = { navigate: NavigateFunction; mutate: unknown };

export function getStore(
  navigate: NavigateFunction,
  apiUtils: ApiUtilsWithoutHistory,
  onRehydrated: () => void
): Store<RootState, RootAction> {
  const reducersFromDescriptions = buildReducersFromDescriptions(reducerDescriptions);

  const rootReducer = combineReducers<RootState>({
    ...reducersFromDescriptions,
  });

  const {
    middleware: offlineMiddleware,
    enhanceReducer: offlineEnhanceReducer,
    enhanceStore: offlineEnhanceStore,
  } = createOffline({
    ...offlineConfig,
    discard: shouldDiscard,
    effect: getEffectReconciler(apiUtils.mutate as Function),
    persistCallback: onRehydrated,
    queue: queueConfig,
    persistOptions: getPersistOptions(),
  });

  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Dependencies>({
    dependencies: { ...apiUtils, navigate },
  });

  const middleware = [epicMiddleware, offlineMiddleware];

  if (process.env.NODE_ENV !== environments.prod) {
    middleware.push(createLogger({ collapsed: true, diff: true }));
  }

  const store = createStore<RootState, RootAction, unknown, unknown>(
    enableBatching(offlineEnhanceReducer(rootReducer)),
    composeWithDevTools(
      compose(offlineEnhanceStore as any, applyMiddleware(...middleware))
    )
  );

  epicMiddleware.run(epics as unknown as Epic<RootAction, RootAction, RootState, Dependencies>);

  return store;
}
