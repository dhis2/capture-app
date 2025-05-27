// @flow
import { EnrollmentFactory } from '../../../../../../metaDataMemoryStoreBuilders/programs/factory/enrollment';
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedProgram,
    CachedTrackedEntityType,
} from '../../../../../../storageControllers/cache.types';
import type { TrackedEntityType } from '../../../../../../metaData';
import { buildSearchGroup } from '../../../../../SearchBox/hooks';
import type { DataEntryFormConfig } from '../types';

type Props = {|
    cachedOptionSets: Array<CachedOptionSet>,
    cachedTrackedEntityType: CachedTrackedEntityType,
    trackedEntityTypeCollection: TrackedEntityType,
    cachedProgram: CachedProgram,
    cachedTrackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: string,
    minorServerVersion: number,
|}

export const buildEnrollmentForm = async ({
    cachedOptionSets,
    cachedTrackedEntityType,
    trackedEntityTypeCollection,
    cachedProgram,
    cachedTrackedEntityAttributes,
    dataEntryFormConfig,
    locale,
    minorServerVersion,
}: Props) => {
    // $FlowFixMe - cachedProgram does not contain trackedEntityTypeAttributes
    const searchGroups = await buildSearchGroup(cachedProgram, locale);
    const enrollmentFactory = new EnrollmentFactory({
        cachedTrackedEntityAttributes: new Map(cachedTrackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(cachedOptionSets.map(optionSet => [optionSet.id, optionSet])),
        cachedTrackedEntityTypes: new Map([[cachedTrackedEntityType.id, cachedTrackedEntityType]]),
        trackedEntityTypeCollection: new Map([[trackedEntityTypeCollection.id, trackedEntityTypeCollection]]),
        locale,
        dataEntryFormConfig,
        minorServerVersion,
    });

    return enrollmentFactory.build(cachedProgram, searchGroups);
};
