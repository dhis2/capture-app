import { createReducerDescription } from '../../trackerRedux';
import { actionTypes as dataStoreActionTypes } from '../../components/DataStore/DataStore.actions';


export const dataStoreDesc = createReducerDescription({
    [dataStoreActionTypes.FETCH_DATA_STORE]: (state, action) => {
        const newState = { ...state };
        newState.dataStore = action.payload?.dataStore;
        newState.userDataStore = action.payload?.userDataStore;
        return newState;
    },
}, 'useNewDashboard', {
    dataStore: undefined,
    userDataStore: undefined,
});
