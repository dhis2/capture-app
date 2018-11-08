// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    STARTUP_DATA_LOAD_CORE: 'StartupDataLoadCore',
};

export const startupDataLoadCore = () => actionCreator(actionTypes.STARTUP_DATA_LOAD_CORE)();
