/* eslint-disable no-await-in-loop */
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

    for (const cachedType of [...cachedTrackedEntityTypes.values()]) {
        const trackedEntityType = await trackedEntityTypeFactory.build(cachedType);
        trackedEntityTypesCollection.set(trackedEntityType.id, trackedEntityType);
    }

    return trackedEntityTypesCollection;
}
