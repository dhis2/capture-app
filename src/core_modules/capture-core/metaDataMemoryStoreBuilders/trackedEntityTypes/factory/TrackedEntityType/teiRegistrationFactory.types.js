// @flow
import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import type { DataEntryFormConfig } from '../../../../components/DataEntries/common/types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    dataEntryFormConfig?: ?DataEntryFormConfig,
|};
