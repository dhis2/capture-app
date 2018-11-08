// @flow
/* eslint-disable import/prefer-default-export */
import { startupDataLoadCore } from 'capture-core/init/init.actions';
import { startupDataLoaded, actionTypes } from './entry.actions';

export const loadStartupData = action$ =>
    action$.ofType(actionTypes.STARTUP_DATA_LOAD)
        .map(() => startupDataLoaded({
            headerBarHeight: 48,
        }));


export const loadStartupDataCore = action$ =>
    action$.ofType(actionTypes.STARTUP_DATA_LOAD)
        .map(() => startupDataLoadCore());
