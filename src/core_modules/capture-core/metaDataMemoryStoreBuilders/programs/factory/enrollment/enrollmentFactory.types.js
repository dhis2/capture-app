// @flow
import type {
    TrackedEntityType,
} from '../../../../metaData';

import type {
    CachedOptionSet, CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers/cache.types';

export type DataEntryPluginSettings = {|
    id: string,
    name: string,
    pluginSource: string,
    type: 'plugin',
    fieldMap: Array<CachedTrackedEntityAttribute>
|}

export type SourceElement = DataEntryPluginSettings | CachedProgramTrackedEntityAttribute;

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    locale: ?string,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    dataEntryFormConfig?: ?Object,
|};
