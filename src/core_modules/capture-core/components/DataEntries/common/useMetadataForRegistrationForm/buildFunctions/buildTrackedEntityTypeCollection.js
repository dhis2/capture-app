// @flow
import { TrackedEntityTypeFactory } from '../../../../../metaDataMemoryStoreBuilders/trackedEntityTypes/factory';
import type { TrackedEntityAttribute } from '../../../../WidgetProfile/DataEntry/FormFoundation/types';
import type { CachedOptionSet, CachedTrackedEntityType } from '../../../../../storageControllers/cache.types';
import type { DataEntryFormConfig } from '../../types';

type Props = {|
    cachedTrackedEntityAttributes: Map<string, TrackedEntityAttribute>,
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
