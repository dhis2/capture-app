// @flow
import type {
    TrackedEntityType,
} from '../../../../metaData';

import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers/cache.types';

type DataEntryPluginSettings = {|
    id: string,
    name: string,
    pluginSource: string,
    fieldMap: Array<CachedTrackedEntityAttribute>
|}

export type SourceElement = DataEntryPluginSettings | CachedTrackedEntityAttribute;

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    locale: ?string,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    dataEntryFormConfig?: ?Object,
|};
