import { useDataMutation } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';

type ErrorReport = {
    message: string;
    uid: string;
};

type TrackedEntity = {
    trackedEntity: string;
};

const trackedEntityDelete: any = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: (trackedEntity: TrackedEntity) => ({
        trackedEntities: [trackedEntity],
    }),
};

const processErrorReports = (error: any): Array<ErrorReport> => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0 ? errorReports : [{ uid: uuid(), message: error.message }];
};

export const useDeleteTrackedEntity = (
    onSuccess?: () => void,
    onError?: (errorReports: Array<ErrorReport>) => void,
) => {
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(trackedEntityDelete, {
        onComplete: () => {
            onSuccess && onSuccess();
        },
        onError: (e: any) => {
            onError && onError(processErrorReports(e));
        },
    });
    return { deleteMutation, deleteLoading };
};
