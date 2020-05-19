// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils/errorCreator';
import StorageController from 'capture-core-utils/storage/StorageController';
import LocalStorageAdapter from 'capture-core-utils/storage/DomLocalStorageAdapter';
import { getContext } from '../context';

const ACCESS_HISTORY_KEY = 'accessHistory';
const cacheKeepCount = {
    LOCAL_STORAGE: 1,
    INDEXED_DB: 5,
};
const errorMessages = {
    DESTROY_FAILED: 'Could not delete user storage',
};

async function addUserCacheToHistory(
    mainStorageController: StorageController,
    userStorageController: StorageController,
) {
    const { applicationStoreNames: mainStores } = getContext();
    const currentStorageName = userStorageController.name;
    const historyContainer = await mainStorageController.get(mainStores.USER_CACHES, ACCESS_HISTORY_KEY);
    const history = historyContainer && historyContainer.values;
    let cleanedHistory;
    if (history) {
        cleanedHistory = history
            .filter(storageName => storageName !== currentStorageName);
    } else {
        cleanedHistory = [];
    }
    const updatedHistory = [currentStorageName, ...cleanedHistory];
    await mainStorageController.set(mainStores.USER_CACHES, {
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
        // $FlowFixMe
        await historyPartToRemove.asyncForEach(async (cache) => {
            const controllerForStorageToRemove =
                new StorageController(cache, 1, { Adapters: [currentAdapterType] });
            try {
                await controllerForStorageToRemove.destroy();
            } catch (error) {
                log.warn(errorCreator(errorMessages.DESTROY_FAILED)({ cache, error }));
            }
        });
        await mainStorageController.set(getContext().applicationStoreNames.USER_CACHES, {
            id: ACCESS_HISTORY_KEY,
            values: remainingHistory,
        });
    }
}

export async function upkeepUserCaches(
) {
    const { storageController, applicationStorageController } = getContext();
    const updatedHistory = await addUserCacheToHistory(applicationStorageController, storageController);
    await removeCaches(updatedHistory, applicationStorageController);
}
