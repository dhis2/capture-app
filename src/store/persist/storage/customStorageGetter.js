// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { getUserStorageController, getMainStorageController, mainStores } from 'capture-core/storageControllers';

const store = 'reduxPersist';

const addCacheRecordToOfflineAccessHistory = async (offlineStorageName: string) => {
    const mainStorageController = getMainStorageController();
    const OFFLINE_ACCESS_HISTORY_KEY = 'offlineDataAccessHistory';
    const historyContainer = await mainStorageController.get(mainStores.USER_CACHES, OFFLINE_ACCESS_HISTORY_KEY);
    const history = historyContainer?.values ?? [];
    const cleanedHistory = history
        .filter(storageName => storageName !== offlineStorageName);
    const updatedHistory = [offlineStorageName, ...cleanedHistory];
    await mainStorageController.set(mainStores.USER_CACHES, {
        id: OFFLINE_ACCESS_HISTORY_KEY,
        values: updatedHistory,
    });
    return updatedHistory;
};

const initStorageController = async () => {
    const offlineStorageName = `${getUserStorageController().name}-offline`;
    // Starting at version 2 because an empty indexedDB is version 1 for some reason (and upgrade is not executed if version has not changed)
    const storageController = new StorageController(offlineStorageName, 2, {
        Adapters: [IndexedDBAdapter],
        objectStores: [store],
    });
    await storageController.open();
    await addCacheRecordToOfflineAccessHistory(offlineStorageName);

    return storageController;
};

export async function getCustomStorage() {
    const storageController = await initStorageController();

    return {
        setItem: (key: string, value: any) => storageController.set(store, {
            id: key,
            value,
        }),
        getItem: (key: string, onRetrieved: (err: ?string, item: ?Object) => void) => {
            storageController
                .get(store, key)
                .then((item) => {
                    onRetrieved(null, item && item.value);
                })
                .catch((error) => {
                    onRetrieved(error, null);
                });
        },
        removeItem: (key: string) => storageController.remove(store, key),
        getAllKeys: (onRetrieved: (err: ?string, keys: ?Array<string>) => void) => {
            storageController
                .getKeys(store)
                .then((keys) => {
                    onRetrieved(null, keys);
                })
                .catch((error) => {
                    onRetrieved(error, null);
                });
        },
    };
}

