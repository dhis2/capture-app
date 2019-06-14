// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityType,
} from '../../storageControllers/cache.types';
import { trackedEntityTypesCollection } from '../../metaDataMemoryStores';
import { TrackedEntityTypeFactory } from './factory';

export default async function buildTrackedEntityTypes(
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
) {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory(
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    );

    // $FlowFixMe
    await [...cachedTrackedEntityTypes.values()].asyncForEach(async (cachedType) => {
        const trackedEntityType = await trackedEntityTypeFactory.build(cachedType);
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    });

    return trackedEntityTypesCollection;
}
