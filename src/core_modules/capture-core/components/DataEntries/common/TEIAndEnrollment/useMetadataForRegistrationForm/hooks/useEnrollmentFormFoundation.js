// @flow
import { useConfig } from '@dhis2/app-runtime';
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { buildEnrollmentForm } from '../buildFunctions/buildEnrollmentForm';
import type { TrackedEntityType, Program } from '../../../../../../metaData';
import { scopeTypes } from '../../../../../../metaData';
import type { CachedOptionSet, CachedTrackedEntityAttribute } from '../../../../../../storageControllers/cache.types';
import type { DataEntryFormConfig } from '../types';

type Props = {
    scopeType: $Values<typeof scopeTypes>,
    optionSets: ?Array<CachedOptionSet>,
    trackedEntityType: ?TrackedEntityType,
    trackedEntityTypeCollection: ?TrackedEntityType,
    program: ?Program,
    cachedTrackedEntityAttributes: ?Array<CachedTrackedEntityAttribute>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    configIsFetched: boolean,
    locale: string,
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
    const { serverVersion: { minor: minorServerVersion } } = useConfig();
    const { data: enrollment, isLoading, error } = useIndexedDBQuery(
        // $FlowFixMe - QueryKey can be undefined
        ['enrollmentForm', program?.id],
        () => buildEnrollmentForm({
            // $FlowFixMe - Flow does not understand that the values are not null here
            cachedProgram: program,
            // $FlowFixMe
            cachedTrackedEntityType: trackedEntityType,
            // $FlowFixMe
            trackedEntityTypeCollection,
            // $FlowFixMe
            cachedTrackedEntityAttributes,
            // $FlowFixMe
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
