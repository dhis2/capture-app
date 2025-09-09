import { useDataMutation } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';

const trackedEntityDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: (trackedEntity: any) => ({
        trackedEntities: [trackedEntity],
    }),
} as const;

const processErrorReports = (error: any): Array<{ message: string; uid: string }> => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0 ? errorReports : [{ uid: uuid(), message: error.message }];
};

export const useDeleteTrackedEntity = (
    onSuccess?: () => void,
    onError?: (errorReports: Array<{ message: string; uid: string }>) => void,
) => {
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(trackedEntityDelete, {
        onComplete: () => {
            onSuccess && onSuccess();
        },
        onError: (e) => {
            onError && onError(processErrorReports(e));
        },
    });
    return { deleteMutation, deleteLoading };
};
