// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { mainStores } from './stores';

const MAIN_STORAGE_KEY = 'dhis2ca';

function getMajorCacheVersion() {
    const appVersion = process.env.REACT_APP_VERSION;
    // $FlowSuppress: Prechecked
    const appMajorVersion = Number(appVersion.split('.')[0]);
    return (appMajorVersion - 30) * 1000;
}

function getMinorCacheVersion() {
    const appCacheVersionAsString = process.env.REACT_APP_CACHE_VERSION;
    const appCacheVersion = Number(appCacheVersionAsString);
    return appCacheVersion;
}   

function getCacheVersion() {
    const majorCacheVersion = getMajorCacheVersion();
    const minorCacheVersion = getMinorCacheVersion();
    return (majorCacheVersion + minorCacheVersion);
}

function createStorageController(storageName: string, AdapterClasses: Array<any>, onCacheExpired: Function) {
    const appCacheVersion = getCacheVersion();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            {
                Adapters: AdapterClasses,
                objectStores: Object.keys(mainStores).map(key => mainStores[key]),
                onCacheExpired,
            },
        );
    return storageController;
}

async function initMainControllerAsync(adapterTypes: Array<any>, onCacheExpired: Function) {
    const mainStorageController = createStorageController(MAIN_STORAGE_KEY, adapterTypes, onCacheExpired);
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
