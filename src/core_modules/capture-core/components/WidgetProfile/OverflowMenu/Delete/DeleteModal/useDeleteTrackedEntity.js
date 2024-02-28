// @flow
import { useDataMutation } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';

const trackedEntityDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: trackedEntity => ({
        trackedEntities: [trackedEntity],
    }),
};

const processErrorReports = (error): Array<{ message: string, uid: string }> => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0 ? errorReports : [{ uid: uuid(), message: error.message }];
};

export const useDeleteTrackedEntity = (
    onSuccess?: () => void,
    onError?: (errorReports: Array<{ message: string, uid: string }>) => void,
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
