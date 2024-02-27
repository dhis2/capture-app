// @flow
import type {
    CachedOptionSet,
    CachedRelationshipType,
    CachedSectionDataElements,
} from '../../../../storageControllers/cache.types';

export type ConstructorInput = {|
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedRelationshipTypes: Array<CachedRelationshipType>,
    locale: ?string,
    minorServerVersion: number,
|};

export type SectionSpecs = {|
    id: string,
    displayName: string,
    displayDescription: string,
    dataElements: ?Array<CachedSectionDataElements>,
|};
