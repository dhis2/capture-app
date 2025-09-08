import { useConfig } from '@dhis2/app-runtime';
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { buildEnrollmentForm } from '../buildFunctions/buildEnrollmentForm';
import type { TrackedEntityType } from '../../../../../../metaData';
import { scopeTypes } from '../../../../../../metaData';
import type { CachedOptionSet, CachedTrackedEntityAttribute, CachedProgram, CachedTrackedEntityType } from '../../../../../../storageControllers';
import type { DataEntryFormConfig } from '../types';

type Props = {
    scopeType: typeof scopeTypes[keyof typeof scopeTypes];
    optionSets: Array<CachedOptionSet>;
    trackedEntityType: CachedTrackedEntityType;
    trackedEntityTypeCollection: TrackedEntityType | null;
    program: CachedProgram;
    cachedTrackedEntityAttributes: Array<CachedTrackedEntityAttribute>;
    dataEntryFormConfig: DataEntryFormConfig | null;
    configIsFetched: boolean;
    locale: string;
};

export const useEnrollmentFormFoundation = ({
    optionSets,
    scopeType,
    trackedEntityType,
    trackedEntityTypeCollection,
    cachedTrackedEntityAttributes,
    dataEntryFormConfig,
    configIsFetched,
    program,
    locale,
}: Props) => {
    const { serverVersion } = useConfig();
    const minorServerVersion = serverVersion?.minor || 0;
    const { data: enrollment, isLoading, error } = useIndexedDBQuery(
        ['enrollmentForm', program?.id],
        () => buildEnrollmentForm({
            cachedProgram: program,
            cachedTrackedEntityType: trackedEntityType,
            // @ts-expect-error - Typescript does not understand that null values are removed in enabled checksks
            trackedEntityTypeCollection,
            cachedTrackedEntityAttributes,
            cachedOptionSets: optionSets,
            dataEntryFormConfig,
            locale,
            minorServerVersion,
        }),
        {
            enabled: (
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                !!optionSets &&
                !!trackedEntityType &&
                !!trackedEntityTypeCollection &&
                !!program &&
                configIsFetched
            ),
        },
    );

    return {
        enrollment,
        isLoading,
        error,
    };
};
