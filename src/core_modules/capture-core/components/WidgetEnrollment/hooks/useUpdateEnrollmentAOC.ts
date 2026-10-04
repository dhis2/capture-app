import { useCallback, useRef } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { useDataMutation, useTimeZoneConversion } from '@dhis2/app-runtime';
import type { Mutation } from 'capture-core-utils/types/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { resolveAttributeOptionCombo } from '../../../metaData';
import { getTermLabelFromProgram, LabelKeys } from '../../../customLabels';
import type { Enrollment, EnrollmentCategoryCombo } from '../enrollment.types';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: Mutation = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: Enrollment) => ({
        enrollments: [enrollment],
    }),
};

type UseUpdateEnrollmentAOCProps = {
    enrollment: Enrollment | null | undefined;
    setEnrollment: (enrollment: Enrollment) => void;
    enrollmentCategoryCombo: EnrollmentCategoryCombo | undefined;
    program: Record<string, unknown> | undefined;
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export const useUpdateEnrollmentAOC = ({
    enrollment,
    setEnrollment,
    enrollmentCategoryCombo,
    program,
    onError,
    onSuccess,
}: UseUpdateEnrollmentAOCProps) => {
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);
    const { fromClientDate } = useTimeZoneConversion();
    const prevEnrollmentRef = useRef(enrollment);

    const [updateEnrollmentMutation, { loading }] = useDataMutation(enrollmentUpdate, {
        onComplete: () => onSuccess?.(),
        onError: (err: any) => {
            if (prevEnrollmentRef.current) setEnrollment(prevEnrollmentRef.current);
            log.error(errorCreator('Enrollment AOC update failed')({ err }));
            onError?.(processErrorReports(err));
        },
    });

    const update = useCallback(async (categoryOptionUids: ReadonlyArray<string>): Promise<boolean> => {
        if (!enrollmentAOCSupported || !enrollment || loading) return false;

        const attributeOptionCombo = resolveAttributeOptionCombo(
            enrollmentCategoryCombo?.categoryOptionCombos ?? [],
            categoryOptionUids,
            enrollmentCategoryCombo?.id,
        );
        if (!attributeOptionCombo) {
            log.error(
                errorCreator(
                    'Could not resolve the selected enrollment category options to an attribute option combo',
                )({
                    categoryOptionUids,
                    enrollmentCategoryComboId: enrollmentCategoryCombo?.id,
                }),
            );
            const { enrollmentLabel } = getTermLabelFromProgram([LabelKeys.enrollmentSingular], { program });
            onError?.(i18n.t(
                'The selected {{enrollmentLabel}} category options are not a valid combination.',
                { enrollmentLabel },
            ));
            return false;
        }

        prevEnrollmentRef.current = enrollment;
        const updatedEnrollment: Enrollment = {
            ...enrollment,
            attributeOptionCombo,
            updatedAt: fromClientDate(new Date()).getServerZonedISOString(),
        };
        setEnrollment(updatedEnrollment);
        updateEnrollmentMutation(updatedEnrollment);
        return true;
    }, [enrollmentAOCSupported, enrollment, setEnrollment, enrollmentCategoryCombo, program, loading,
        updateEnrollmentMutation, onError, fromClientDate]);

    return { update, loading };
};
