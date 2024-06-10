// @flow
import { useDataMutation, type QueryRefetchFunction } from '@dhis2/app-runtime';
import { useRef } from 'react';

const enrollmentUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: enrollment => ({
        enrollments: [enrollment],
    }),
};

const enrollmentDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: enrollment => ({
        enrollments: [enrollment],
    }),
};

const processErrorReports = (error) => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc, errorReport) => `${acc} ${errorReport.message}`, '')
        : error.message;
};


export const useUpdateEnrollment = (
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    onError?: ?(message: string) => void,
    onSuccess?: ({redirect?: boolean}) => void,
) => {
    const redirect: {current: boolean} = useRef(false);
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
    onError?: ?(message: string) => void,
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

