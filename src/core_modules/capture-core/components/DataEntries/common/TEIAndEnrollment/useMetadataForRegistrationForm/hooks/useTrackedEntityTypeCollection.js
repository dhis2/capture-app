// @flow
import { useConfig } from '@dhis2/app-runtime';
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { buildTrackedEntityTypeCollection } from '../buildFunctions/buildTrackedEntityTypeCollection';
import type { OptionSet, TrackedEntityType } from '../../../../../../metaData';
import { getTrackedEntityAttributes } from '../getFunctions/getTrackedEntityAttributes';
import type { CachedTrackedEntityType } from '../../../../../../storageControllers/cache.types';
import type { DataEntryFormConfig } from '../types';

type Props = {
    trackedEntityType: ?CachedTrackedEntityType,
    optionSets: ?Array<OptionSet>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    configIsFetched: boolean,
    locale: ?string,
};

type ReturnValues = {|
    trackedEntityTypeCollection: ?TrackedEntityType,
|};

export const useTrackedEntityTypeCollection = ({
    trackedEntityType,
    optionSets,
    dataEntryFormConfig,
    configIsFetched,
    locale,
}: Props): ReturnValues => {
    const { data: trackedEntityAttributes } = useIndexedDBQuery(
        // $FlowFixMe - QueryKey can be undefined
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

    const { serverVersion: { minor: minorServerVersion } } = useConfig();

    const { data: trackedEntityTypeCollection } = useIndexedDBQuery(
        // $FlowFixMe - QueryKey can be undefined
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
            dataEntryFormConfig,
            // $FlowFixMe
            locale,
            minorServerVersion,
        }),
        {
            enabled:
                !!trackedEntityType &&
                !!optionSets &&
                !!trackedEntityAttributes &&
                !!locale &&
                configIsFetched,
        },
    );

    return {
        trackedEntityTypeCollection,
    };
};
