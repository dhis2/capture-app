// @flow
import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { saveDataStore } from './DataStore.actions';
import { type UseNewDashboard } from './DataStore.types';
import { appStartActionTypes } from '../../../../components/AppStart';
import { programCollection } from '../../metaDataMemoryStores';

const setNewDashboardByDefault = (key: string, dataStoreValues) => {
    const programs = [...programCollection.keys()];
    const valuesWithDefault = programs.reduce((acc, program) => {
        const dataStoreValue = dataStoreValues[program];
        acc[program] = dataStoreValue !== undefined ? dataStoreValue : true;
        return acc;
    }, {});

    return { [key]: valuesWithDefault };
};

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
            return saveDataStore(setNewDashboardByDefault('dataStore', apiDataStore));
        }),
        catchError(() => EMPTY),
    );

export const fetchUserDataStoreEpic = (action$: InputObservable, _: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD_SUCESS),
        mergeMap(async () => {
            const apiUserDataStore: UseNewDashboard = await getUserDataStoreFromApi(querySingleResource);
            // $FlowFixMe
            return saveDataStore(setNewDashboardByDefault('userDataStore', apiUserDataStore));
        }),
        catchError(() => EMPTY),
    );

