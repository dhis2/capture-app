// @flow
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    minorServerVersion: number,
|};
