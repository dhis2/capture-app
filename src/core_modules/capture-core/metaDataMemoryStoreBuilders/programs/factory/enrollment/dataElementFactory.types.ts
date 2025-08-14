import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers';

export type ConstructorInput = {
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedOptionSets: Map<string, CachedOptionSet>;
    locale?: string | null | undefined;
    minorServerVersion: number;
};
