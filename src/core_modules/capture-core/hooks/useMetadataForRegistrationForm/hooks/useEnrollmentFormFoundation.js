// @flow
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';
import { buildEnrollmentForm } from '../buildFunctions/buildEnrollmentForm';
import type { TrackedEntityType, Program } from '../../../metaData';
import type {
    OptionSet,
    TrackedEntityAttribute,
} from '../types';
import { scopeTypes } from '../../../metaData';

type Props = {
    scopeType: $Values<typeof scopeTypes>,
    optionSets: ?Array<OptionSet>,
    trackedEntityType: ?TrackedEntityType,
    trackedEntityTypeCollection: ?TrackedEntityType,
    program: ?Program,
    cachedTrackedEntityAttributes: ?TrackedEntityAttribute[],
    locale: string,
};

export const useEnrollmentFormFoundation = ({
    optionSets,
    scopeType,
    trackedEntityType,
    trackedEntityTypeCollection,
    cachedTrackedEntityAttributes,
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
            locale,
        }),
        {
            enabled: (
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                !!optionSets &&
                !!trackedEntityType &&
                !!trackedEntityTypeCollection &&
                !!program
            ),
        },
    );

    return {
        enrollment,
        isLoading,
        error,
    };
};
