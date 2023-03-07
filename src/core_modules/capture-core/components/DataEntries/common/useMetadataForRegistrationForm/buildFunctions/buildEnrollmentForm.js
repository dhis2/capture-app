// @flow
import { EnrollmentFactory } from '../../../../../metaDataMemoryStoreBuilders/programs/factory/enrollment';
import type {
    OptionSet,
    TrackedEntityAttribute,
} from '../../../../WidgetProfile/DataEntry/FormFoundation/types';
import type { CachedProgram, CachedTrackedEntityType } from '../../../../../storageControllers/cache.types';
import type { TrackedEntityType } from '../../../../../metaData';
import { buildSearchGroup } from '../../../../Pages/Search/hooks';
import type { DataEntryFormConfig } from '../../types';

type Props = {|
    cachedOptionSets: OptionSet[],
    cachedTrackedEntityType: CachedTrackedEntityType,
    trackedEntityTypeCollection: TrackedEntityType,
    cachedProgram: CachedProgram,
    cachedTrackedEntityAttributes: TrackedEntityAttribute[],
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: string,
|}

export const buildEnrollmentForm = async ({
    cachedOptionSets,
    cachedTrackedEntityType,
    trackedEntityTypeCollection,
    cachedProgram,
    cachedTrackedEntityAttributes,
    dataEntryFormConfig,
    locale,
}: Props) => {
    const searchGroups = await buildSearchGroup(cachedProgram);
    const enrollmentFactory = new EnrollmentFactory({
        cachedTrackedEntityAttributes: new Map(cachedTrackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(cachedOptionSets.map(optionSet => [optionSet.id, optionSet])),
        cachedTrackedEntityTypes: new Map([[cachedTrackedEntityType.id, cachedTrackedEntityType]]),
        trackedEntityTypeCollection: new Map([[trackedEntityTypeCollection.id, trackedEntityTypeCollection]]),
        locale,
        dataEntryFormConfig,
    });

    return enrollmentFactory.build(cachedProgram, searchGroups);
};
