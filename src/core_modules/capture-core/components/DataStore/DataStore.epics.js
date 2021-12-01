// @flow
import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { appStartActionTypes } from '../../../../components/AppStart';
import { getApi } from '../../d2';
import { fetchDataStore } from './DataStore.actions';
import { type UseNewDashboard } from './DataStore.types';

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
