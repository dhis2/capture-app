// @flow
import { getApi } from '../d2/d2Instance';

export const effectConfig = (effect: OfflineEffect) => {
    const { url, method, data } = effect;
    return getApi()[method](url, data);
};
