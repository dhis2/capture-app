// @flow
import type
{
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import type {
    DataEntryFormConfig,
} from '../../../../components/DataEntries/common/TEIAndEnrollment/useMetadataForRegistrationForm/types';

export type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    locale: ?string,
    dataEntryFormConfig?: ?DataEntryFormConfig,
    minorServerVersion: number,
|};
