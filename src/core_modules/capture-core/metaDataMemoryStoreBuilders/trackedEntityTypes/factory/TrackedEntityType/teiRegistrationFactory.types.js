// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    dataEntryFormConfig?: Object,
|};
