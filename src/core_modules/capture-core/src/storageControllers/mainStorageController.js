// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import availableAdapters from 'capture-core-utils/storage/availableAdapters';
import { mainStores } from './stores';

const MAIN_STORAGE_KEY = 'dhis2ca';

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

function createStorageController(storageName: string, AdapterClasses: Array<any>) {
    const appCacheVersion = getCacheVersion();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            AdapterClasses,
            Object.keys(mainStores).map(key => mainStores[key]),
            storage => storage.set(mainStores.STATUS, {
                id: 'fallback',
                value: true,
            }),
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

    const fallback = await mainStorageController.get(mainStores.STATUS, 'fallback');
    if (fallback && fallback.value) {
        const fallbackStorageController = createStorageController(MAIN_STORAGE_KEY, [availableAdapters.MEMORY]);
        await fallbackStorageController.open();
        return fallbackStorageController;
    }
    return mainStorageController;
}

export default initMainControllerAsync;
