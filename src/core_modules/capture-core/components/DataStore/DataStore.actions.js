// @flow
import { actionCreator } from '../../actions/actions.utils';
import { type UseOldDashboard, actionTypes as DataStoreActionTypes } from './DataStore.types';


export const fetchDataStore = ({ dataStore, userDataStore }: UseOldDashboard) =>
    actionCreator(DataStoreActionTypes.FETCH_DATA_STORE)({ dataStore, userDataStore });
