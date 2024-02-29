// @flow
import { trackedEntityTypesCollection } from '../../metaDataMemoryStores';
import { TrackedEntityTypeFactory } from './factory';
import type { BuildTrackedEntityTypesInput } from './trackedEntityTypesBuilder.types';

export async function buildTrackedEntityTypes({
    cachedTrackedEntityTypes,
    cachedTrackedEntityAttributes,
    cachedOptionSets,
    locale,
    minorServerVersion,
}: BuildTrackedEntityTypesInput) {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
        minorServerVersion,
    });

    // $FlowFixMe
    await [...cachedTrackedEntityTypes.values()].asyncForEach(async (cachedType) => {
        const trackedEntityType = await trackedEntityTypeFactory.build(cachedType);
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    });

    return trackedEntityTypesCollection;
}
