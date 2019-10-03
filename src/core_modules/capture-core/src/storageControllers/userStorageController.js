// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { getCurrentUser } from '../d2/d2Instance';
import { metaDataStores, reduxPersistStores, maintenanceStores } from './stores';

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

function createStorageController(
    mainStorageController: StorageController,
) {
    const storageName = getStorageName(mainStorageController.name);
    const appCacheVersion = getCacheVersion();
    const stores = getStores();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            [mainStorageController.adapterType],
            stores,
            () => mainStorageController.setWithoutFallback(maintenanceStores.STATUS, {
                id: 'fallback',
                value: true,
            }),
        );
    return storageController;
}

async function initUserControllerAsync(mainStorageController: StorageController) {
    const userStorageController =
        createStorageController(mainStorageController);

    let upgradeTempData;
    await userStorageController
        .open(
            storage => storage
                .get(reduxPersistStores.REDUX_PERSIST, 'reduxPersist:offline')
                .then((data) => {
                    upgradeTempData = data;
                }),
            (storage) => {
                if (!upgradeTempData) {
                    return null;
                }
                return storage
                    .set(reduxPersistStores.REDUX_PERSIST, upgradeTempData);
            },
            (objectStore, adapter) => {
                if (adapter === IndexedDBAdapter) {
                    if (objectStore.name === metaDataStores.CATEGORY_OPTIONS) {
                        objectStore.createIndex('category', 'categories', { multiEntry: true });
                    }
                }
            },
        );
    return userStorageController;
}

export default initUserControllerAsync;
