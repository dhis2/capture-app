// @flow
import { mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { getApi } from '../../d2';
import { appStartActionTypes } from '../../../../components/AppStart';
import { type UseNewDashboard } from './DataStore.types';
import { fetchDataStore } from './DataStore.actions';

function getDataStoreFromApi() {
    const api = getApi();
    return api
        .get('dataStore/capture/useNewDashboard');
}

const getUserDataStoreFromApi = () => {
    const api = getApi();
    return api.get('userDataStore/capture/useNewDashboard');
};

export const fetchDataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            appStartActionTypes.APP_LOAD_SUCESS,
        ),
        mergeMap(async () => {
            const apiDataStore: UseNewDashboard = await getDataStoreFromApi();
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
            const apiUserDataStore: UseNewDashboard = await getUserDataStoreFromApi();
            // $FlowFixMe
            return fetchDataStore({ userDataStore: apiUserDataStore });
        }),
        catchError(() => EMPTY),
    );
