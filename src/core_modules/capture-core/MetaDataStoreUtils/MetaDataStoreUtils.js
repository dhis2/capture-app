// @flow
import { typeof userStores } from '../storageControllers/stores';
import { getUserStorageController } from '../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (store: $Values<userStores>, key: string) => {
    const storageController = getUserStorageController();
    return storageController.get(store, key);
};

export const containsKeyInStorageAsync = (store: $Values<userStores>, key: string) => {
    const storageController = getUserStorageController();
    return storageController.contains(store, key);
};
