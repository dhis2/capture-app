// @flow
import { TrackedEntityTypeFactory } from '../../../../../../metaDataMemoryStoreBuilders/trackedEntityTypes/factory';
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../../../storageControllers/cache.types';
import type { DataEntryFormConfig } from '../../types';

type Props = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityType: CachedTrackedEntityType,
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: string,
|}

export const buildTrackedEntityTypeCollection = async ({
    cachedTrackedEntityAttributes,
    cachedOptionSets,
    cachedTrackedEntityType,
    dataEntryFormConfig,
    locale,
}: Props) => {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory(
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
        dataEntryFormConfig,
    );

    return trackedEntityTypeFactory.build(cachedTrackedEntityType);
};
