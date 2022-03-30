// @flow
import { actionCreator } from '../../actions/actions.utils';
import { type UseNewDashboard, actionTypes as DataStoreActionTypes } from './DataStore.types';


export const fetchDataStore = ({ dataStore, userDataStore }: UseNewDashboard) =>
    actionCreator(DataStoreActionTypes.FETCH_DATA_STORE)({ dataStore, userDataStore });
