// @flow
import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { saveDataStore } from './DataStore.actions';
import { type UseNewDashboard } from './DataStore.types';
import { appStartActionTypes } from '../../../../components/AppStart';

const getDataStoreFromApi = async querySingleResource =>
    querySingleResource({
        resource: 'dataStore/capture/useNewDashboard',
    });

const getUserDataStoreFromApi = async querySingleResource =>
    querySingleResource({
        resource: 'userDataStore/capture/useNewDashboard',
    });

export const fetchDataStoreEpic = (action$: InputObservable, _: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD_SUCESS),
        mergeMap(async () => {
            const apiDataStore: UseNewDashboard = await getDataStoreFromApi(querySingleResource);
            // $FlowFixMe
            return saveDataStore({ dataStore: apiDataStore });
        }),
        catchError(() => EMPTY),
    );

export const fetchUserDataStoreEpic = (action$: InputObservable, _: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD_SUCESS),
        mergeMap(async () => {
            const apiUserDataStore: UseNewDashboard = await getUserDataStoreFromApi(querySingleResource);
            // $FlowFixMe
            return saveDataStore({ userDataStore: apiUserDataStore });
        }),
        catchError(() => EMPTY),
    );

