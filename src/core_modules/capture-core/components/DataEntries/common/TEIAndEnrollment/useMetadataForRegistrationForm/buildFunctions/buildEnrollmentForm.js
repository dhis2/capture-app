// @flow
import { EnrollmentFactory } from '../../../../../../metaDataMemoryStoreBuilders/programs/factory/enrollment';
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedProgram,
    CachedTrackedEntityType,
} from '../../../../../../storageControllers/cache.types';
import type { TrackedEntityType } from '../../../../../../metaData';
import { buildSearchGroup } from '../../../../../Pages/Search/hooks';

type Props = {|
    cachedOptionSets: Array<CachedOptionSet>,
    cachedTrackedEntityType: CachedTrackedEntityType,
    trackedEntityTypeCollection: TrackedEntityType,
    cachedProgram: CachedProgram,
    cachedTrackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
    locale: string,
|}

export const buildEnrollmentForm = async ({
    cachedOptionSets,
    cachedTrackedEntityType,
    trackedEntityTypeCollection,
    cachedProgram,
    cachedTrackedEntityAttributes,
    locale,
}: Props) => {
    const searchGroups = await buildSearchGroup(cachedProgram);
    const enrollmentFactory = new EnrollmentFactory({
        cachedTrackedEntityAttributes: new Map(cachedTrackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(cachedOptionSets.map(optionSet => [optionSet.id, optionSet])),
        cachedTrackedEntityTypes: new Map([[cachedTrackedEntityType.id, cachedTrackedEntityType]]),
        trackedEntityTypeCollection: new Map([[trackedEntityTypeCollection.id, trackedEntityTypeCollection]]),
        locale,
    });

    return enrollmentFactory.build(cachedProgram, searchGroups);
};
