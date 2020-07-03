// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { loadCore, actionTypes as coreActionTypes, batchActionTypes as coreBatchActionTypes } from 'capture-core/init';
import { loadAppSuccess, loadAppFailed, actionTypes } from './entry.actions';

// $FlowFixMe[cannot-resolve-name] automated comment
export const triggerLoadCoreEpic = (action$: ActionsObservable) =>
    action$.ofType(actionTypes.APP_LOAD)
        .map(() => loadCore());

export const loadAppEpic = (action$: ActionsObservable) =>
    action$.ofType(coreBatchActionTypes.CORE_LOAD_SUCCESS_BATCH)
        .map(() => loadAppSuccess({
            headerBarHeight: 48,
        }));

export const loadCoreFailedEpic = (action$: ActionsObservable) =>
    action$.ofType(coreActionTypes.CORE_LOAD_FAILED)
        .map((action) => {
            const { error } = action.payload;
            log.error(errorCreator('load core failed')({ error }));
            return loadAppFailed('APP FAILED TO LOAD. SEE LOG FOR DETAILS');
        });
