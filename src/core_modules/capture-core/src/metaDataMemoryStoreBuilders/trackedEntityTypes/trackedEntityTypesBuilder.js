// @flow
import type {
    CachedProgramTrackedEntityType,
} from '../cache.types';
import { trackedEntityTypesCollection } from '../../metaDataMemoryStores';
import { TrackedEntityType } from '../../metaData';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';
import StorageController from '../../storage/StorageController';

function getCachedTrackedEntityTypes(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

export default async function buildTrackedEntityTypes(
    store: string,
    trackedEntityAttributes: Array<CachedProgramTrackedEntityType> = [],
) {
    const storageController = getStorageController();
    const cachedTrackedEntityTypes = (await getCachedTrackedEntityTypes(storageController, store)) || [];

    cachedTrackedEntityTypes.forEach((cachedType) => {
        const trackedEntityType = new TrackedEntityType((_this) => {
            _this.id = cachedType.id;
            _this.name = cachedType.displayName;
        });
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    });

    return trackedEntityTypesCollection;
}
