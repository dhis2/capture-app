// @flow
import type {
    CachedOptionSet,
    CachedRelationshipType,
    CachedSectionDataElements,
} from '../../../../storageControllers/cache.types';
import type {
    DataEntryFormConfig,
} from '../../../../components/DataEntries';

export type ConstructorInput = {|
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedRelationshipTypes: Array<CachedRelationshipType>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: ?string,
    minorServerVersion: number,
|};

export type SectionSpecs = {|
    id: string,
    displayName: string,
    displayDescription: string,
    dataElements: ?Array<CachedSectionDataElements>,
|};
