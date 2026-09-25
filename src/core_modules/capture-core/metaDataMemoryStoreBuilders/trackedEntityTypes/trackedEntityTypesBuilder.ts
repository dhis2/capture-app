import { trackedEntityTypesCollection } from '../../metaDataMemoryStores';
import { TrackedEntityTypeFactory } from './factory';
import type { BuildTrackedEntityTypesInput } from './trackedEntityTypesBuilder.types';

export async function buildTrackedEntityTypes({
    cachedTrackedEntityTypes,
    cachedTrackedEntityAttributes,
    cachedOptionSets,
    locale,
}: BuildTrackedEntityTypesInput) {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    });

    // @ts-expect-error - keeping original functionality as before ts rewrite
    await [...cachedTrackedEntityTypes.values()].asyncForEach(async (cachedType) => {
        const trackedEntityType = await trackedEntityTypeFactory.build(cachedType);
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    });

    return trackedEntityTypesCollection;
}
