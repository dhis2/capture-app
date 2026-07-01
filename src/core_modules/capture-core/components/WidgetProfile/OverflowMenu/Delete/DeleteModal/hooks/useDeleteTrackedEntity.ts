import { useDataMutation } from '@dhis2/app-runtime';
import { processErrorReports, type ErrorReport } from '../../../processErrorReports';

const trackedEntityDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: (trackedEntity: any) => ({
        trackedEntities: [trackedEntity],
    }),
} as const;

export const useDeleteTrackedEntity = (
    onSuccess?: () => void,
    onError?: (errorReports: Array<ErrorReport>) => void,
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
