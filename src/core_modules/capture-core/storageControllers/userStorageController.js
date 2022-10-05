// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { userStores } from './stores/index';

function getStorageName(mainStorageName: string, user: { id: string }) {
    return mainStorageName + user.id;
}

function getStores() {
    const userStoresList = Object.keys(userStores).map(key => userStores[key]);
    return userStoresList;
}

function createStorageController(
    mainStorageController: typeof StorageController,
    currentUser: { id: string },
) {
    const storageName = getStorageName(mainStorageController.name, currentUser);
    const appCacheVersion = mainStorageController.version;
    const stores = getStores();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            {
                Adapters: [mainStorageController.adapterType],
                objectStores: stores,
            },
        );
    return storageController;
}

const storeSpecificCreateActions = {
    [userStores.CATEGORY_OPTIONS]: (objectStore) => {
        objectStore.createIndex('categoryId', 'categories', { multiEntry: true });
    },
    [userStores.PROGRAM_RULES]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [userStores.PROGRAM_RULES_VARIABLES]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [userStores.PROGRAM_INDICATORS]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [userStores.ORGANISATION_UNIT_GROUPS]: (objectStore) => {
        objectStore.createIndex('organisationUnitId', 'organisationUnitIds', { multiEntry: true });
    },
};

export async function initUserControllerAsync(mainStorageController: typeof StorageController, currentUser: { id: string }) {
    const userStorageController =
        createStorageController(mainStorageController, currentUser);

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
            (objectStore, adapter) => {
                if (adapter === IndexedDBAdapter) {
                    storeSpecificCreateActions[objectStore.name] &&
                    storeSpecificCreateActions[objectStore.name](objectStore);
                }
            },
        );
    return userStorageController;
}
