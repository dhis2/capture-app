// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityType,
} from '../../storageControllers/cache.types';

export type BuildTrackedEntityTypesInput = {|
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    minorServerVersion: number,
|};
