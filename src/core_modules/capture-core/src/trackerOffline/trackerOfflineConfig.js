// @flow
import defaultQueue from '@redux-offline/redux-offline/lib/defaults/queue';
import { getApi } from '../d2/d2Instance';

export const effectConfig = (effect: OfflineEffect) => {
    const { url, method, data } = effect;
    return getApi()[method](url, data);
};

export const queueConfig = {
    ...defaultQueue,
    enqueue(array, action) {
        const newArray = array.filter(item =>
            !(item.method === action.method && item.url === action.url),
        );
        newArray.push(action);
        return newArray;
    },
};

export const discardConfig = (error: ?{httpStatusCode?: number}) => {
    const statusCode = error && error.httpStatusCode;
    return statusCode && statusCode >= 400 && statusCode < 500;
};
