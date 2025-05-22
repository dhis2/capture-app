import { useDataMutation } from '@dhis2/app-runtime';
import { useRef } from 'react';
import type { QueryRefetchFunction } from '../enrollment.types';

const enrollmentUpdate: any = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
    id: 'enrollmentUpdate',
};

const enrollmentDelete: any = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
    id: 'enrollmentDelete',
};

const processErrorReports = (error: any) => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc: string, errorReport: any) => `${acc} ${errorReport.message}`, '')
        : error.message;
};

export const useUpdateEnrollment = (
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    onError?: (message: string) => void,
    onSuccess?: (options: { redirect?: boolean }) => void,
) => {
    const redirect = useRef(false);
    const changeRedirect = (value: boolean) => (redirect.current = value);

    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetchEnrollment();
                refetchTEI();
                onSuccess && onSuccess({ redirect: redirect.current });
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return {
        updateMutation, updateLoading, changeRedirect,
    };
};

export const useDeleteEnrollment = (
    onDelete: () => void,
    onError?: (message: string) => void,
    onSuccess?: () => void,
) => {
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(
        enrollmentDelete,
        {
            onComplete: () => {
                onDelete();
                onSuccess && onSuccess();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return { deleteMutation, deleteLoading };
};
