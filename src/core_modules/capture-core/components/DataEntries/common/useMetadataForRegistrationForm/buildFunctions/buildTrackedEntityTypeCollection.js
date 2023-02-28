// @flow
import { TrackedEntityTypeFactory } from '../../../../../metaDataMemoryStoreBuilders/trackedEntityTypes/factory';
import type { TrackedEntityAttribute } from '../../../../WidgetProfile/DataEntry/FormFoundation/types';
import type { CachedOptionSet, CachedTrackedEntityType } from '../../../../../storageControllers/cache.types';

type Props = {|
    cachedTrackedEntityAttributes: Map<string, TrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityType: CachedTrackedEntityType,
    locale: string,
|}

export const buildTrackedEntityTypeCollection = async ({
    cachedTrackedEntityAttributes,
    cachedOptionSets,
    cachedTrackedEntityType,
    locale,
}: Props) => {
    const trackedEntityTypeFactory = new TrackedEntityTypeFactory(
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    );

    return trackedEntityTypeFactory.build(cachedTrackedEntityType);
};
