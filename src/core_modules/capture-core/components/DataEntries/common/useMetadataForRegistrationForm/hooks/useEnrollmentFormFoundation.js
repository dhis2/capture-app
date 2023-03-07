// @flow
import { useIndexedDBQuery } from '../../../../../utils/reactQueryHelpers';
import { buildEnrollmentForm } from '../buildFunctions/buildEnrollmentForm';
import type { TrackedEntityType, Program } from '../../../../../metaData';
import type { OptionSet, TrackedEntityAttribute } from '../../../../WidgetProfile/DataEntry/FormFoundation/types';
import { scopeTypes } from '../../../../../metaData';
import type { DataEntryFormConfig } from '../../types';

type Props = {
    scopeType: $Values<typeof scopeTypes>,
    optionSets: ?Array<OptionSet>,
    trackedEntityType: ?TrackedEntityType,
    trackedEntityTypeCollection: ?TrackedEntityType,
    program: ?Program,
    cachedTrackedEntityAttributes: ?TrackedEntityAttribute[],
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
    const { data: enrollment, isLoading, error } = useIndexedDBQuery(
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
