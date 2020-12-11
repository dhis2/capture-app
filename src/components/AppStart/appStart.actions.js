// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const appStartActionTypes = {
  APP_LOAD: 'AppLoad',
  APP_LOAD_SUCESS: 'AppLoadSuccess',
  APP_LOAD_FAILED: 'AppLoadFailed',
};

export const loadApp = () => actionCreator(appStartActionTypes.APP_LOAD)();
export const loadAppSuccess = (payload: mixed) =>
  actionCreator(appStartActionTypes.APP_LOAD_SUCESS)(payload);
export const loadAppFailed = (message: string) =>
  actionCreator(appStartActionTypes.APP_LOAD_FAILED)({ message });
