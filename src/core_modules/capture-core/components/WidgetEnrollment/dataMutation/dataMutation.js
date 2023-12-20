// @flow
import { useDataMutation, type QueryRefetchFunction } from '@dhis2/app-runtime';


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
) => {
    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetchEnrollment();
                refetchTEI();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return {
        updateMutation, updateLoading,
    };
};

export const useDeleteEnrollment = (
    onDelete: () => void,
    onError?: ?(message: string) => void,
) => {
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(
        enrollmentDelete,
        {
            onComplete: onDelete,
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    return { deleteMutation, deleteLoading };
};

