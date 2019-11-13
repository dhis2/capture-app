// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { mainStores } from './stores';

const MAIN_STORAGE_KEY = 'dhis2ca';

function getMajorCacheVersion() {
    const appVersion = appPackage.VERSION; // eslint-disable-line
    // $FlowSuppress: Prechecked
    const appMajorVersion = Number(appVersion.split('.')[0]);
    return (appMajorVersion - 30) * 1000;
}

function getMinorCacheVersion() {
    const appCacheVersionAsString = appPackage.CACHE_VERSION; // eslint-disable-line
    const appCacheVersion = Number(appCacheVersionAsString);
    return appCacheVersion;
}

function getCacheVersion() {
    const majorCacheVersion = getMajorCacheVersion();
    const minorCacheVersion = getMinorCacheVersion();
    return (majorCacheVersion + minorCacheVersion);
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
