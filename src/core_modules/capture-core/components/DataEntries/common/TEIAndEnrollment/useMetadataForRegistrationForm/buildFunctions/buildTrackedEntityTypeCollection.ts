import { TrackedEntityTypeFactory } from '../../../../../../metaDataMemoryStoreBuilders/trackedEntityTypes/factory';
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../../../storageControllers';
import type { DataEntryFormConfig } from '../types';

type Props = {
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedOptionSets: Map<string, CachedOptionSet>;
    cachedTrackedEntityType: CachedTrackedEntityType;
    dataEntryFormConfig: DataEntryFormConfig | null;
    locale: string;
    minorServerVersion?: number;
};

export const buildTrackedEntityTypeCollection = async ({
    cachedTrackedEntityAttributes,
    cachedOptionSets,
    cachedTrackedEntityType,
    dataEntryFormConfig,
    locale,
    minorServerVersion,
}: Props) => {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
        dataEntryFormConfig,
        minorServerVersion: minorServerVersion ?? 0,
    });
    return trackedEntityTypeFactory.build(cachedTrackedEntityType);
};
