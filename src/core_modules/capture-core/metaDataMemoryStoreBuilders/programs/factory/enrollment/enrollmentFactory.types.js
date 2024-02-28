// @flow
import type {
    TrackedEntityType,
} from '../../../../metaData';

import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers/cache.types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    locale: ?string,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    dataEntryFormConfig?: ?Object,
    minorServerVersion: number,
|};
