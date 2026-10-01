import { useCallback } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { useDataMutation, useTimeZoneConversion } from '@dhis2/app-runtime';
import type { Mutation, QueryRefetchFunction } from 'capture-core-utils/types/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { resolveAttributeOptionCombo, type CategoryOptionCombo } from '../../../metaData';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: Mutation = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
};

type EnrollmentCategoryCombo = {
    id: string;
    isDefault?: boolean;
    categoryOptionCombos?: Array<CategoryOptionCombo>;
};

type UseUpdateEnrollmentAOCProps = {
    enrollment: any;
    enrollmentCategoryCombo: EnrollmentCategoryCombo | undefined;
    refetchEnrollment: QueryRefetchFunction;
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export const useUpdateEnrollmentAOC = ({
    enrollment,
    enrollmentCategoryCombo,
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

        const attributeOptionCombo = resolveAttributeOptionCombo(
            enrollmentCategoryCombo?.categoryOptionCombos ?? [],
            categoryOptionUids,
            enrollmentCategoryCombo?.id,
        );
        if (!attributeOptionCombo) {
            onError?.(i18n.t('Could not save: selected category options are not a valid combination.'));
            return false;
        }

        try {
            await updateEnrollmentMutation({
                ...enrollment,
                attributeOptionCombo,
                updatedAt: fromClientDate(new Date()).getServerZonedISOString(),
            });
            return true;
        } catch (err) {
            log.error(errorCreator('Enrollment AOC update failed')({ err }));
            return false;
        }
    }, [enrollmentAOCSupported, enrollment, enrollmentCategoryCombo, saving,
        updateEnrollmentMutation, onError, fromClientDate]);

    return { update, saving };
};
