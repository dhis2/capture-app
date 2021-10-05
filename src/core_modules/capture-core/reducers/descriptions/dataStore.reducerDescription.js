import { createReducerDescription } from '../../trackerRedux';
import { actionTypes as dataStoreActionTypes } from '../../components/DataStore/DataStore.types';


export const dataStoreDesc = createReducerDescription({
    [dataStoreActionTypes.FETCH_DATA_STORE]: (state, action) => {
        const newState = { ...state };
        action.payload.dataStore && (
            newState.dataStore = action.payload?.dataStore
        );

        action.payload.userDataStore && (
            newState.userDataStore = action.payload?.userDataStore
        );

        return newState;
    },
}, 'useNewDashboard', {
    dataStore: undefined,
    userDataStore: undefined,
});
