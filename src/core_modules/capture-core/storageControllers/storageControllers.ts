import type { StorageController } from 'capture-core-utils/storage';
import { availableAdapters } from 'capture-core-utils/storage/availableAdapters';
import { initMainController } from './mainStorageController';
import { initUserMetadataController } from './userMetadataStorageController';
import { initUserDataStorageController } from './userDataStorageController';
import { upkeepUserCaches } from './upkeepUserCaches';
import type { ServerVersion } from './types';


const adapterTypes: any = [availableAdapters.INDEXED_DB];
// storageControllers declaration
const storageControllers: { [key: string]: StorageController } = {};

export const initStorageControllers = async ({
    onCacheExpired,
    currentUserId,
    serverVersion,
    baseUrl,
}: { onCacheExpired: any; currentUserId: string; serverVersion: ServerVersion; baseUrl: string }) => {
    storageControllers.main = await initMainController({ adapterTypes, onCacheExpired, serverVersion, baseUrl });

    const userMetadataStorageName = `${storageControllers.main.name}-${currentUserId}-metadata`;
    const userDataStorageName = `${storageControllers.main.name}-${currentUserId}-data`;
    await upkeepUserCaches(storageControllers.main, userMetadataStorageName, userDataStorageName);

    // storageControllers.userMetadata value is asynchronously assigned
    storageControllers.userMetadata = await initUserMetadataController({
        storageName: userMetadataStorageName,
        version: storageControllers.main.version,
        adapterTypes: [storageControllers.main.adapterType],
    });

    storageControllers.userData = await initUserDataStorageController({
        storageName: userDataStorageName,
        adapterTypes: [storageControllers.main.adapterType],
    });
};

export const closeStorageControllers = () => Promise.all([
    storageControllers.main.close(),
    storageControllers.userMetadata.close(),
    storageControllers.userData.close(),
]);

export const getMainStorageController = () => storageControllers.main;

export const getUserMetadataStorageController = () => storageControllers.userMetadata;

export const getUserDataStorageController = () => storageControllers.userData;
