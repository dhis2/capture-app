// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../cache.types';
import { trackedEntityTypesCollection } from '../../metaDataMemoryStores';
import { TrackedEntityTypeFactory } from './factory';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';
import StorageController from '../../storage/StorageController';

function getCachedTrackedEntityTypes(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

export default async function buildTrackedEntityTypes(
    store: string,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
) {
    const storageController = getStorageController();
    const cachedTrackedEntityTypes = (await getCachedTrackedEntityTypes(storageController, store)) || [];

    const trackedEntityTypeFactory = new TrackedEntityTypeFactory(
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    );

    // $FlowFixMe
    await cachedTrackedEntityTypes.asyncForEach(async (cachedType) => {
        const trackedEntityType = await trackedEntityTypeFactory.build(cachedType);
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    });

    return trackedEntityTypesCollection;
}
