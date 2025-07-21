import { useConfig } from '@dhis2/app-runtime';
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { buildTrackedEntityTypeCollection } from '../buildFunctions/buildTrackedEntityTypeCollection';
import type { OptionSet, TrackedEntityType } from '../../../../../../metaData';
import { getTrackedEntityAttributes } from '../getFunctions/getTrackedEntityAttributes';
import type { CachedTrackedEntityType } from '../../../../../../storageControllers';
import type { DataEntryFormConfig } from '../types';

type Props = {
    trackedEntityType: CachedTrackedEntityType | null;
    optionSets: Array<OptionSet> | null;
    dataEntryFormConfig: DataEntryFormConfig | null;
    configIsFetched: boolean;
    locale: string;
};

type ReturnValues = {
    trackedEntityTypeCollection: TrackedEntityType | null;
};

export const useTrackedEntityTypeCollection = ({
    trackedEntityType,
    optionSets,
    dataEntryFormConfig,
    configIsFetched,
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
                }, [] as string[]) ?? []),
        { enabled: !!trackedEntityType },
    );

    const { serverVersion } = useConfig();
    const minorServerVersion = serverVersion?.minor;

    const { data: trackedEntityTypeCollection } = useIndexedDBQuery(
        ['trackedEntityTypeCollection', trackedEntityType?.id],
        () => buildTrackedEntityTypeCollection({
            cachedTrackedEntityType: trackedEntityType,
            cachedTrackedEntityAttributes: new Map(
                trackedEntityAttributes
                    ?.map(trackedEntityAttribute => [trackedEntityAttribute.id, trackedEntityAttribute]),
            ),
            cachedOptionSets: new Map(optionSets?.map(optionSet => [optionSet.id, optionSet])),
            dataEntryFormConfig,
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
