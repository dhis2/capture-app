import { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Mutation, QueryRefetchFunction } from 'capture-core-utils/types/app-runtime';
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
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onComplete: () => {
            refetchEnrollment();
            onSuccess?.();
        },
        onError: (e) => {
            onError?.(processErrorReports(e));
        },
    });

    return useCallback((attributeCategoryOptions: string) => {
        if (!enrollment) return;
        updateEnrollmentMutation({
            ...enrollment,
            attributeCategoryOptions,
        });
    }, [enrollment, updateEnrollmentMutation]);
};
