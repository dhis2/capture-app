import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers';

export type ConstructorInput = {
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: string | null;
};

export type InputSearchAttribute = {
    trackedEntityAttributeId: string;
    searchable: boolean;
    displayInList: boolean;
    renderOptionsAsRadio?: boolean | null;
};

export type SearchAttribute = InputSearchAttribute & {
    trackedEntityAttribute: CachedTrackedEntityAttribute;
};
