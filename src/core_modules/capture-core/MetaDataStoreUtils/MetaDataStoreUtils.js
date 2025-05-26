// @flow
import { getUserMetadataStorageController, typeof USER_METADATA_STORES } from '../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (
    store: $Values<USER_METADATA_STORES>,
    key: string,
    propsToPass?: any = {},
) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(store, key).then(response => ({ response, ...propsToPass }));
};

export const containsKeyInStorageAsync = (store: $Values<USER_METADATA_STORES>, key: string, propsToPass?: any = {}) => {
    const storageController = getUserMetadataStorageController();
    return storageController.contains(store, key).then(response => ({ response, ...propsToPass }));
};
