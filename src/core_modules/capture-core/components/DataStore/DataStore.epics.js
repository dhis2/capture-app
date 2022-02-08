// @flow
import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { fetchDataStore } from './DataStore.actions';
import { getApi } from '../../d2';
import { type UseOldDashboard } from './DataStore.types';
import { appStartActionTypes } from '../../../../components/AppStart';

function getDataStoreFromApi() {
    const api = getApi();
    return api
        .get('dataStore/capture/useOldDashboard');
}

const getUserDataStoreFromApi = () => {
    const api = getApi();
    return api.get('userDataStore/capture/useOldDashboard');
};

export const fetchDataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            appStartActionTypes.APP_LOAD_SUCESS,
        ),
        mergeMap(async () => {
            const apiDataStore: UseOldDashboard = await getDataStoreFromApi();
            // $FlowFixMe
            return fetchDataStore({ dataStore: apiDataStore });
        }),
        catchError(() => EMPTY),
    );

export const fetchUserDataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            appStartActionTypes.APP_LOAD_SUCESS,
        ),
        mergeMap(async () => {
            const apiUserDataStore: UseOldDashboard = await getUserDataStoreFromApi();
            // $FlowFixMe
            return fetchDataStore({ userDataStore: apiUserDataStore });
        }),
        catchError(() => EMPTY),
    );
