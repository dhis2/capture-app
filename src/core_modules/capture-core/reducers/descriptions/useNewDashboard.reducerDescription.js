// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as dataStoreActionTypes } from '../../components/DataStore/DataStore.types';

export const useNewDashboardDesc = createReducerDescription({
    [dataStoreActionTypes.SAVE_DATA_STORE]: (state, action) => {
        const newState = { ...state };
        const { dataStore, userDataStore } = action.payload;
        newState.dataStore = dataStore;
        newState.userDataStore = userDataStore;

        return newState;
    },
}, 'useNewDashboard', {
    dataStore: undefined,
    userDataStore: undefined,
});
