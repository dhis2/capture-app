import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (store: keyof typeof USER_METADATA_STORES, key: string) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(store, key);
};
