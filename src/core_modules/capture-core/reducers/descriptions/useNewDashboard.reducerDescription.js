// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { newDashboardActionTypes } from '../../utils/routing/newDashboard.actions';
import { actionTypes as dataStoreActionTypes } from '../../components/DataStore/DataStore.types';

export const useNewDashboardDesc = createReducerDescription({
    [newDashboardActionTypes.ENABLE_NEW_DASHBOARDS_TEMPORARILY]:
        (state, { payload: { programs } }) => ({
            ...state,
            temp: programs.reduce((acc, program) => {
                acc[program] = true;
                return acc;
            }, state.temp || {}),
        }),
    [dataStoreActionTypes.SAVE_DATA_STORE]: (state, action) => {
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
    temp: undefined,
});
