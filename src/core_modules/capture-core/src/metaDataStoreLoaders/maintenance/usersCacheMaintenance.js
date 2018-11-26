// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import LocalStorageAdapter from 'capture-core-utils/storage/DomLocalStorageAdapter';
import { getMainStorageController, getUserStorageController } from '../../storageControllers';
import { maintenanceStores } from '../../storageControllers/stores';

const ACCESS_HISTORY_KEY = 'accessHistory';
const cacheKeepCount = {
    LOCAL_STORAGE: 1,
    INDEXED_DB: 5,
};

async function addUserCacheToHistory(
    mainStorageController: StorageController,
    userStorageController: StorageController,
) {
    const currentStorageName = userStorageController.name;
    const historyContainer = await mainStorageController.get(maintenanceStores.USER_CACHES, ACCESS_HISTORY_KEY);
    const history = historyContainer && historyContainer.values;
    let cleanedHistory;
    if (history) {
        cleanedHistory = history
            .filter(storageName => storageName !== currentStorageName);
    } else {
        cleanedHistory = [];
    }
    const updatedHistory = [currentStorageName, ...cleanedHistory];
    await mainStorageController.set(maintenanceStores.USER_CACHES, {
        id: ACCESS_HISTORY_KEY,
        values: updatedHistory,
    });
    return updatedHistory;
}

async function removeCaches(
    history: Array<string>,
    mainStorageController: StorageController,
) {
    const currentAdapterType = mainStorageController.adapterType;
    const keepCount = currentAdapterType === LocalStorageAdapter
        ? cacheKeepCount.LOCAL_STORAGE
        : cacheKeepCount.INDEXED_DB;

    if (history.length > keepCount) {
        const historyPartToRemove = history.slice(keepCount);
        const remainingHistory = history.slice(0, keepCount);
        await historyPartToRemove.asyncForEach(async (cache) => {
            const controllerForStorageToRemove =
                new StorageController(cache, 1, [currentAdapterType], ['some store']);
            await controllerForStorageToRemove.destroy();
        });
        await mainStorageController.set(maintenanceStores.USER_CACHES, {
            id: ACCESS_HISTORY_KEY,
            values: remainingHistory,
        });
    }
}

async function executeUsersCacheMaintenance(
) {
    const mainStorageController = getMainStorageController();
    const userStorageController = getUserStorageController();
    const updatedHistory = await addUserCacheToHistory(mainStorageController, userStorageController);
    await removeCaches(updatedHistory, mainStorageController);
}

export default executeUsersCacheMaintenance;
