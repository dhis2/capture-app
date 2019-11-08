// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { mainStores } from './stores';

const MAIN_STORAGE_KEY = 'dhis2ca';

function getCacheVersion() {
    const appCacheVersionAsString = process.env.REACT_APP_CACHE_VERSION;
    if (!appCacheVersionAsString) {
        throw new Error('cache version not specified');
    }
    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion)) {
        throw new Error('invalid cache version');
    }
    return appCacheVersion;
}

function createStorageController(storageName: string, AdapterClasses: Array<any>) {
    const appCacheVersion = getCacheVersion();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            AdapterClasses,
            Object.keys(mainStores).map(key => mainStores[key]),
        );
    return storageController;
}

async function initMainControllerAsync(adapterTypes: Array<any>) {
    const mainStorageController = createStorageController(MAIN_STORAGE_KEY, adapterTypes);
    let upgradeTempData;
    await mainStorageController.open(
        storage => storage
            .get(mainStores.USER_CACHES, 'accessHistory')
            .then((data) => {
                upgradeTempData = data;
            }),
        (storage) => {
            if (!upgradeTempData) {
                return null;
            }
            return storage
                .set(mainStores.USER_CACHES, upgradeTempData);
        },
    );

    return mainStorageController;
}

export default initMainControllerAsync;
