// @flow
import { typeof StorageController } from 'capture-core-utils/storage';
import { availableAdapters } from 'capture-core-utils/storage/availableAdapters';
import { initMainController } from './mainStorageController';
import { initUserController } from './userStorageController';
import type { ServerVersion } from './types';

const adapterTypes = [availableAdapters.INDEXED_DB];
const storageControllers: { [key: string]: StorageController } = {};

export async function initAsync({
    onCacheExpired,
    currentUserId,
    serverVersion,
    baseUrl,
}: { onCacheExpired: Function, currentUserId: string, serverVersion: ServerVersion, baseUrl: string }) {
    storageControllers.main = await initMainController({ adapterTypes, onCacheExpired, serverVersion, baseUrl });
    storageControllers.user = await initUserController(storageControllers.main, currentUserId);
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
