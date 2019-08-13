// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import availableAdapters from 'capture-core-utils/storage/availableAdapters';
import initUserControllerAsync from './userStorageController';
import initMainControllerAsync from './mainStorageController';

const adapterTypes = [availableAdapters.INDEXED_DB, availableAdapters.LOCAL_STORAGE, availableAdapters.MEMORY];
const storageControllers: { [key: string]: StorageController } = {};

export async function initAsync() {
    storageControllers.main = await initMainControllerAsync(adapterTypes);
    storageControllers.user = await initUserControllerAsync(storageControllers.main);
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
