// @flow
import { typeof userStores } from '../storageControllers/stores';
import { getUserStorageController } from '../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (
    store: $Values<userStores>,
    key: string,
    propsToPass?: any = {},
) => {
    const storageController = getUserStorageController();
    return storageController.get(store, key).then(response => ({ response, ...propsToPass }));
};

export const containsKeyInStorageAsync = (store: $Values<userStores>, key: string, propsToPass?: any = {}) => {
    const storageController = getUserStorageController();
    return storageController.contains(store, key).then(response => ({ response, ...propsToPass }));
};
