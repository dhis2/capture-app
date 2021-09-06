// @flow

import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { fetchDataStore } from './DataStore.actions';
import { getApi } from '../../d2';
import type { UseNewDashboard } from './DataStore.actions';
import { appStartActionTypes } from '../../../../components/AppStart';

function getDataStoreFromApi() {
    const api = getApi();
    return api
        .get('dataStore/capture/useNewDashboard');
}

export const dataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            appStartActionTypes.APP_LOAD_SUCESS,
        ),
        mergeMap(async () => {
            const apiDataStore: UseNewDashboard = await getDataStoreFromApi();
            // $FlowFixMe
            return fetchDataStore(apiDataStore);
        }),
    );
