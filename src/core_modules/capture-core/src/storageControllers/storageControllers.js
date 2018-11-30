// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import availableAdapters from 'capture-core-utils/storage/availableAdapters';
import createUserStorageController from './userStorageController';
import createMainStorageController from './mainStorageController';
import { reduxPersistStores } from './stores/index';
import maintenanceStoresConst from './stores/maintenanceStores.const';

const MAIN_STORAGE_KEY = 'dhis2ca';
let adapterTypes = [availableAdapters.INDEXED_DB, availableAdapters.LOCAL_STORAGE, availableAdapters.MEMORY];
const storageControllers: { [key: string]: StorageController } = {};

function initUserControllerAsync(adapterType: any, mainStorageController: StorageController) {
    const userStorageController = createUserStorageController(MAIN_STORAGE_KEY, [adapterType], mainStorageController);
    storageControllers.user = userStorageController;

    let upgradeTempData;
    return userStorageController
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
        );
}

async function initMainControllerAsync() {
    const mainStorageController = createMainStorageController(MAIN_STORAGE_KEY, adapterTypes);
    storageControllers.main = mainStorageController;
    await mainStorageController.open();
    const fallback = await mainStorageController.get(maintenanceStoresConst.STATUS, 'fallback');
    if (fallback && fallback.value) {
        adapterTypes = [availableAdapters.MEMORY];
        const fallbackStorageController = createMainStorageController(MAIN_STORAGE_KEY, adapterTypes);
        storageControllers.main = fallbackStorageController;
        await fallbackStorageController.open();
    }
}

export async function initAsync() {
    await initMainControllerAsync();
    await initUserControllerAsync(storageControllers.main.adapterType, storageControllers.main);
}

export function closeAsync() {
    const mainPromise = storageControllers.main.close();
    const userPromise = storageControllers.user.close();
    return Promise.all([mainPromise, userPromise]);
}

export function getMainController() {
    return storageControllers.main;
}

export function getUserController() {
    return storageControllers.user;
}
