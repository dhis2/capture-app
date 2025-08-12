import { getUserMetadataStorageController, USER_METADATA_STORES } from '../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (
    store: typeof USER_METADATA_STORES[keyof typeof USER_METADATA_STORES],
    key: string,
    propsToPass: any = {},
) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(store, key).then(response => ({ response, ...propsToPass }));
};

export const containsKeyInStorageAsync = (store: any, key: string, propsToPass: any = {}) => {
    const storageController = getUserMetadataStorageController();
    return storageController.contains(store, key).then(response => ({ response, ...propsToPass }));
};
