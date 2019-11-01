// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { getCurrentUser } from '../d2/d2Instance';
import { mainStores, userStores } from './stores/index';

function getStorageName(mainStorageName: string) {
    const user = getCurrentUser();
    return mainStorageName + user.id;
}

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

function getStores() {
    const userStoresList = Object.keys(userStores).map(key => userStores[key]);
    return userStoresList;
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
            () => mainStorageController.setWithoutFallback(mainStores.STATUS, {
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
                .get(userStores.REDUX_PERSIST, 'reduxPersist:offline')
                .then((data) => {
                    upgradeTempData = data;
                }),
            (storage) => {
                if (!upgradeTempData) {
                    return null;
                }
                return storage
                    .set(userStores.REDUX_PERSIST, upgradeTempData);
            },
        );
    return userStorageController;
}

export default initUserControllerAsync;
