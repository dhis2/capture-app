import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    CONFIG_SAVE_REQUEST: 'ConfigSaveRequest',
};

export const requestConfigSave = () =>
    actionCreator(actionTypes.CONFIG_SAVE_REQUEST)();
