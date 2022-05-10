// @flow
import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { saveDataStore } from './DataStore.actions';
import { getApi } from '../../d2';
import { type UseNewDashboard } from './DataStore.types';
import { appStartActionTypes } from '../../../../components/AppStart';

function getDataStoreFromApi() {
    const api = getApi();
    return api.get('dataStore/capture/useNewDashboard');
}

const getUserDataStoreFromApi = () => {
    const api = getApi();
    return api.get('userDataStore/capture/useNewDashboard');
};

export const fetchDataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD_SUCESS),
        mergeMap(async () => {
            const apiDataStore: UseNewDashboard = await getDataStoreFromApi();
            // $FlowFixMe
            return saveDataStore({ dataStore: apiDataStore });
        }),
        catchError(() => EMPTY),
    );

export const fetchUserDataStoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD_SUCESS),
        mergeMap(async () => {
            const apiUserDataStore: UseNewDashboard = await getUserDataStoreFromApi();
            // $FlowFixMe
            return saveDataStore({ userDataStore: apiUserDataStore });
        }),
        catchError(() => EMPTY),
    );
