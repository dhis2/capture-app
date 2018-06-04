// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    STARTUP_DATA_LOAD: 'StartupDataLoad',
    STARTUP_DATA_LOADED: 'StartupDataLoaded',
};

export const startupDataLoad = () => actionCreator(actionTypes.STARTUP_DATA_LOAD)();
export const startupDataLoaded = (payload: mixed) => actionCreator(actionTypes.STARTUP_DATA_LOADED)(payload);
