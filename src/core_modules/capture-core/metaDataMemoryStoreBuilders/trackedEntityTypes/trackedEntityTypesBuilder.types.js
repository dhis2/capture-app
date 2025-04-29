// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityType,
} from '../../storageControllers';

export type BuildTrackedEntityTypesInput = {|
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    minorServerVersion: number,
|};
