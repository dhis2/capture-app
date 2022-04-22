// @flow
import { actionCreator } from '../../actions/actions.utils';
import { type UseNewDashboard, actionTypes as dataStoreActionTypes } from './DataStore.types';

export const saveDataStore = ({ dataStore, userDataStore }: UseNewDashboard) =>
    actionCreator(dataStoreActionTypes.SAVE_DATA_STORE)({ dataStore, userDataStore });
