// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    FETCH_DATA_STORE: 'useNewDashboard.FetchDataStore',
};

export type UseNewDashboard = {|
    [key: string]: string,
|}

export const fetchDataStore = (dataStore: UseNewDashboard) =>
    actionCreator(actionTypes.FETCH_DATA_STORE)({ dataStore });
