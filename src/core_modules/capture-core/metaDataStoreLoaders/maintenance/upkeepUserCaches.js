// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils/errorCreator';
import { StorageController, DomLocalStorageAdapter } from 'capture-core-utils/storage';
import { getMainStorageController, getUserStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

const ACCESS_HISTORY_KEY = 'accessHistory';
const cacheKeepCount = {
  LOCAL_STORAGE: 1,
  INDEXED_DB: 5,
};
const errorMessages = {
  DESTROY_FAILED: 'Could not delete user storage',
};

async function addUserCacheToHistory(mainStorageController: typeof StorageController) {
  const { name: currentStorageName } = getUserStorageController();
  const historyContainer = await mainStorageController.get(
    mainStores.USER_CACHES,
    ACCESS_HISTORY_KEY,
  );
  const history = historyContainer && historyContainer.values;
  let cleanedHistory;
  if (history) {
    cleanedHistory = history.filter((storageName) => storageName !== currentStorageName);
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
  mainStorageController: typeof StorageController,
) {
  const currentAdapterType = mainStorageController.adapterType;
  const keepCount =
    currentAdapterType === DomLocalStorageAdapter
      ? cacheKeepCount.LOCAL_STORAGE
      : cacheKeepCount.INDEXED_DB;

  if (history.length > keepCount) {
    const historyPartToRemove = history.slice(keepCount);
    const remainingHistory = history.slice(0, keepCount);
    // $FlowFixMe
    await historyPartToRemove.asyncForEach(async (cache) => {
      const controllerForStorageToRemove = new StorageController(cache, 1, {
        Adapters: [currentAdapterType],
      });
      try {
        await controllerForStorageToRemove.destroy();
      } catch (error) {
        log.warn(
          errorCreator(errorMessages.DESTROY_FAILED)({
            cache,
            error,
          }),
        );
      }
    });
    await mainStorageController.set(mainStores.USER_CACHES, {
      id: ACCESS_HISTORY_KEY,
      values: remainingHistory,
    });
  }
}

export async function upkeepUserCaches() {
  const mainStorageController = getMainStorageController();
  const updatedHistory = await addUserCacheToHistory(mainStorageController);
  await removeCaches(updatedHistory, mainStorageController);
}
