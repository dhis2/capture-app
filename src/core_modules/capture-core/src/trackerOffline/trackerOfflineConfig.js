// @flow
import { getApi } from '../d2/d2Instance';

export const effectConfig = (effect: OfflineEffect) => {
    const { url, method, data } = effect;
    return getApi()[method](url, data);
};

export const discardConfig = (error: ?{httpStatusCode?: number}) => {
    const statusCode = error && error.httpStatusCode;
    return statusCode && statusCode >= 400 && statusCode < 500;
};
