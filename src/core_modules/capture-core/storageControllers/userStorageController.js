// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { userStores } from './stores/index';

function getStorageName(mainStorageName: string, userId: string) {
    return `${mainStorageName}-${userId}`;
}

function getStores() {
    const userStoresList = Object.keys(userStores).map(key => userStores[key]);
    return userStoresList;
}

function createStorageController(
    mainStorageController: typeof StorageController,
    currentUserId: string,
) {
    const storageName = getStorageName(mainStorageController.name, currentUserId);
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

export async function initUserController(mainStorageController: typeof StorageController, currentUserId: string) {
    const userStorageController =
        createStorageController(mainStorageController, currentUserId);

    await userStorageController
        .open({
            onCreateObjectStore: (objectStore, adapter) => {
                if (adapter === IndexedDBAdapter) {
                    storeSpecificCreateActions[objectStore.name] &&
                    storeSpecificCreateActions[objectStore.name](objectStore);
                }
            },
        });
    return userStorageController;
}
