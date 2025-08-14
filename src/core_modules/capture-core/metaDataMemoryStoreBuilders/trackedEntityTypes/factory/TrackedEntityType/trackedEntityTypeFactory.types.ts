import type {
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers';
import type {
    DataEntryFormConfig,
} from '../../../../components/DataEntries/common/TEIAndEnrollment';

export type ConstructorInput = {
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: string | null;
    dataEntryFormConfig?: DataEntryFormConfig | null | undefined;
    minorServerVersion: number;
};
