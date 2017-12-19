// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import getD2 from 'capture-core/d2/d2Instance';

import { startupDataLoaded, actionTypes } from './entry.actions';


export const loadStartupData = action$ =>
    action$.ofType(actionTypes.STARTUP_DATA_LOAD).concatMap((action) => {
        return getD2().models.programs.list({ paging: false })
            .then(programCollection => startupDataLoaded(programCollection.toArray()));
    });
