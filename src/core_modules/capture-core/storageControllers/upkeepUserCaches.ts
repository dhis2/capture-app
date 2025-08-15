import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { StorageController, DomLocalStorageAdapter } from 'capture-core-utils/storage';
import { ACCESS_HISTORY_KEYS, MAIN_STORES } from './constants';

const cacheKeepCount = {
    LOCAL_STORAGE: 1,
    INDEXED_DB: 3,
};
const errorMessages = {
    DESTROY_FAILED: 'Could not delete user storage',
};

async function addCacheRecordToAccessHistory(
    mainStorageController: typeof StorageController,
    accessHistoryKey: string,
    currentStorageName: string,
) {
    const historyContainer = await mainStorageController.get(MAIN_STORES.USER_CACHES, accessHistoryKey);
    const history = historyContainer?.values;
    let cleanedHistory;
    if (history) {
        cleanedHistory = history
            .filter(storageName => storageName !== currentStorageName);
    } else {
        cleanedHistory = [];
    }
    const updatedHistory = [currentStorageName, ...cleanedHistory];
    await mainStorageController.set(MAIN_STORES.USER_CACHES, {
        id: accessHistoryKey,
        values: updatedHistory,
    });
    return updatedHistory;
}

async function removeMetadataCaches(
    history: Array<string>,
    mainStorageController: typeof StorageController,
) {
    const currentAdapterType = mainStorageController.adapterType;
    const keepCount = currentAdapterType === DomLocalStorageAdapter
        ? cacheKeepCount.LOCAL_STORAGE
        : cacheKeepCount.INDEXED_DB;

    if (history.length > keepCount) {
        const historyPartToRemove = history.slice(keepCount);
        let remainingHistory = history.slice(0, keepCount);
        // @ts-expect-error - keeping original functionality as before ts rewrite
        await historyPartToRemove.asyncForEach(async (storageName) => {
            const controllerForStorageToRemove =
                new StorageController(storageName, 1, { Adapters: [currentAdapterType] });
            try {
                await controllerForStorageToRemove.destroy();
            } catch (error) {
                remainingHistory = [...remainingHistory, storageName];
                log.warn(errorCreator(errorMessages.DESTROY_FAILED)({ cache: storageName, error }));
            }
        });
        await mainStorageController.set(MAIN_STORES.USER_CACHES, {
            id: ACCESS_HISTORY_KEYS.ACCESS_HISTORY_KEY_METADATA,
            values: remainingHistory,
        });
    }
}

export const upkeepUserCaches = async (
    mainStorageController: typeof StorageController,
    userMetadataStorageName: string,
    userDataStorageName: string,
) => {
    await addCacheRecordToAccessHistory(
        mainStorageController,
        ACCESS_HISTORY_KEYS.ACCESS_HISTORY_KEY_DATA,
        userDataStorageName,
    );
    const updatedUserMetadataHistory = await addCacheRecordToAccessHistory(
        mainStorageController,
        ACCESS_HISTORY_KEYS.ACCESS_HISTORY_KEY_METADATA,
        userMetadataStorageName,
    );

    await removeMetadataCaches(updatedUserMetadataHistory, mainStorageController);
};
