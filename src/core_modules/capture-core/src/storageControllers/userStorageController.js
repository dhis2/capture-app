// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { getCurrentUser } from '../d2/d2Instance';
import { metaDataStores, reduxPersistStores } from './stores/index';

function getStorageName(mainStorageName: string) {
    const user = getCurrentUser();
    return mainStorageName + user.id;
}

function getCacheVersion() {
    const appCacheVersionAsString = appPackage.CACHE_VERSION; // eslint-disable-line
    if (!appCacheVersionAsString) {
        throw new Error('cache version not specified');
    }
    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion)) {
        throw new Error('invalid cache version');
    }
    return appCacheVersion;
}

function getStores() {
    const metaDataStoreList = Object.keys(metaDataStores).map(key => metaDataStores[key]);
    const persistStoreList = Object.keys(reduxPersistStores).map(key => reduxPersistStores[key]);
    return [...metaDataStoreList, ...persistStoreList];
}

function createStorageController(mainStorageName: string, AdapterClasses: Array<any>) {
    const storageName = getStorageName(mainStorageName);
    const appCacheVersion = getCacheVersion();
    const stores = getStores();
    const storageController =
        new StorageController(storageName, appCacheVersion, AdapterClasses, stores);
    return storageController;
}

export default createStorageController;
