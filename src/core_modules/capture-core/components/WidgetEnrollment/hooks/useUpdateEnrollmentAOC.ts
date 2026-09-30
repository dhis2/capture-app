import { useCallback } from 'react';
import { useDataMutation, useTimeZoneConversion } from '@dhis2/app-runtime';
import type { Mutation, QueryRefetchFunction } from 'capture-core-utils/types/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { getTrackerProgramThrowIfNotFound } from '../../../metaData';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: Mutation = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
};

type UseUpdateEnrollmentAOCProps = {
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    onError?: (error: any) => void;
    onSuccess?: () => void;
};

export const useUpdateEnrollmentAOC = ({
    enrollment,
    refetchEnrollment,
    onError,
    onSuccess,
}: UseUpdateEnrollmentAOCProps) => {
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);
    const { fromClientDate } = useTimeZoneConversion();

    const [updateEnrollmentMutation, { loading: saving }] = useDataMutation(enrollmentUpdate, {
        onComplete: () => {
            refetchEnrollment();
            onSuccess?.();
        },
        onError: (e) => {
            onError?.(processErrorReports(e));
        },
    });

    const update = useCallback(async (categoryOptionUids: ReadonlyArray<string>): Promise<boolean> => {
        if (!enrollmentAOCSupported || !enrollment || saving) return false;

        const { enrollmentCategoryCombination } = getTrackerProgramThrowIfNotFound(enrollment.program);
        const attributeOptionCombo = enrollmentCategoryCombination?.resolveAttributeOptionCombo(categoryOptionUids);
        if (!attributeOptionCombo) {
            onError?.('Could not resolve the selected category options to an attribute option combo.');
            return false;
        }

        try {
            await updateEnrollmentMutation({
                ...enrollment,
                attributeOptionCombo,
                updatedAt: fromClientDate(new Date()).getServerZonedISOString(),
            });
            return true;
        } catch {
            return false;
        }
    }, [enrollmentAOCSupported, enrollment, saving, updateEnrollmentMutation, onError, fromClientDate]);

    return { update, saving };
};
