// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';

import { startupDataLoaded, actionTypes } from './entry.actions';


export const loadStartupData = action$ =>
    action$.ofType(actionTypes.STARTUP_DATA_LOAD).map((action) => {
        return startupDataLoaded({
            headerBarHeight: 48,
        });
    });
