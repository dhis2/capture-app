import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (store: typeof USER_METADATA_STORES[keyof typeof USER_METADATA_STORES], key: string) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(store, key);
};
