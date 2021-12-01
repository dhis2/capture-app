// @flow
import { getUserStorageController } from '../../../storageControllers';
import { typeof userStores } from '../../../storageControllers/stores';

export const getCachedSingleResourceFromKeyAsync = (store: $Values<userStores>, key: string) => {
    const storageController = getUserStorageController();
    return storageController.get(store, key);
};
