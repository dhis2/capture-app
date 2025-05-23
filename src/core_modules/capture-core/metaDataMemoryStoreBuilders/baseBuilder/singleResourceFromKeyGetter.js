// @flow
import { getUserMetadataStorageController, typeof USER_METADATA_STORES } from '../../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (store: $Values<USER_METADATA_STORES>, key: string) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(store, key);
};
