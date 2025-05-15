// @flow
import type {
    CachedDataElement,
    CachedOptionSet,
    CachedRelationshipType,
    CachedSectionDataElements,
} from '../../../../storageControllers/cache.types';
import type {
    DataEntryFormConfig,
} from '../../../../components/DataEntries/common/TEIAndEnrollment';

export type ConstructorInput = {|
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedDataElements?: Map<string, CachedDataElement>,
    cachedRelationshipTypes: Array<CachedRelationshipType>,
    dataEntryFormConfig?: ?DataEntryFormConfig,
    locale: ?string,
    minorServerVersion: number,
|};

export type SectionSpecs = {|
    id: string,
    displayName: string,
    displayDescription: string,
    dataElements: ?Array<CachedSectionDataElements>,
|};
