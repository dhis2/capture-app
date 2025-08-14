import type {
    TrackedEntityType,
} from '../../../../metaData';

import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers';

export type ConstructorInput = {
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedOptionSets: Map<string, CachedOptionSet>;
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>;
    locale?: string | null | undefined;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    dataEntryFormConfig?: any;
    minorServerVersion: number;
};
