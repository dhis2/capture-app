// @flow
/* eslint-disable import/prefer-default-export */
import { startupDataLoaded, actionTypes } from './entry.actions';

export const loadStartupData = action$ =>
    action$.ofType(actionTypes.STARTUP_DATA_LOAD).map((action) => {
        return startupDataLoaded({
            headerBarHeight: 48,
        });
    });
