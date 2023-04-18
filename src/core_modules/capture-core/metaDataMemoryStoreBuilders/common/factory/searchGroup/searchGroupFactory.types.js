// @flow
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
|};

export type InputSearchAttribute = {
    trackedEntityAttributeId: string,
    searchable: boolean,
    displayInList: boolean,
    renderOptionsAsRadio: ?boolean,
};

export type SearchAttribute = {
    ...InputSearchAttribute,
    trackedEntityAttribute: CachedTrackedEntityAttribute,
};
