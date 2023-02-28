// @flow
import { useIndexedDBQuery } from '../../../../../utils/reactQueryHelpers';
import { buildTrackedEntityTypeCollection } from '../buildFunctions/buildTrackedEntityTypeCollection';
import type { OptionSet, TrackedEntityType } from '../../../../../metaData';
import { getTrackedEntityAttributes } from '../getFunctions/getTrackedEntityAttributes';
import type { CachedTrackedEntityType } from '../../../../../storageControllers/cache.types';

type Props = {
    trackedEntityType: ?CachedTrackedEntityType,
    optionSets: ?Array<OptionSet>,
    locale: ?string,
};

type ReturnValues = {|
    trackedEntityTypeCollection: ?TrackedEntityType,
|};

export const useTrackedEntityTypeCollection = ({
    trackedEntityType,
    optionSets,
    locale,
}: Props): ReturnValues => {
    const { data: trackedEntityAttributes } = useIndexedDBQuery(
        ['trackedEntityAttributes', trackedEntityType?.id],
        () => getTrackedEntityAttributes(
            trackedEntityType
                ?.trackedEntityTypeAttributes
                ?.reduce((acc, { trackedEntityAttributeId }) => {
                    if (trackedEntityAttributeId) {
                        acc.push(trackedEntityAttributeId);
                    }
                    return acc;
                }, []) ?? []),
        { enabled: !!trackedEntityType },
    );

    const { data: trackedEntityTypeCollection } = useIndexedDBQuery(
        ['trackedEntityTypeCollection', trackedEntityType?.id],
        () => buildTrackedEntityTypeCollection({
            // $FlowFixMe
            cachedTrackedEntityType: trackedEntityType,
            cachedTrackedEntityAttributes: new Map(
                trackedEntityAttributes
                    ?.map(trackedEntityAttribute => [trackedEntityAttribute.id, trackedEntityAttribute]),
            ),
            // $FlowFixMe
            cachedOptionSets: new Map(optionSets?.map(optionSet => [optionSet.id, optionSet])),
            // $FlowFixMe
            locale,
        }),
        { enabled: !!trackedEntityType && !!optionSets && !!trackedEntityAttributes && !!locale },
    );

    return {
        trackedEntityTypeCollection,
    };
};
