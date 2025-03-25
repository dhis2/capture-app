import { StorageController } from 'capture-core-utils/storage';
import { availableAdapters } from 'capture-core-utils/storage/availableAdapters';
import { initUserControllerAsync } from './userStorageController';
import { initMainControllerAsync } from './mainStorageController';

const adapterTypes = [availableAdapters.INDEXED_DB];
const storageControllers: Record<string, StorageController> = {};

export async function initAsync(onCacheExpired: () => void, currentUserId: string): Promise<void> {
    storageControllers.main = await initMainControllerAsync(adapterTypes, onCacheExpired);
    storageControllers.user = await initUserControllerAsync(storageControllers.main, currentUserId);
}

export async function closeAsync(): Promise<void> {
    const mainPromise = storageControllers.main.close();
    const userPromise = storageControllers.user.close();
    return Promise.all([mainPromise, userPromise]);
}

export function getMainController(): StorageController {
    return storageControllers.main;
}

export function getUserController(): StorageController {
    return storageControllers.user;
}
