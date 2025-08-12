import { getUserMetadataStorageController } from '../storageControllers';

export const getCachedSingleResourceFromKeyAsync = (
    store: any,
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
