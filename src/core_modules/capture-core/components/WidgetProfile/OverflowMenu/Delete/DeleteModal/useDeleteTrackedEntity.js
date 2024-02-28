// @flow
import { useDataMutation } from '@dhis2/app-runtime';

const trackedEntityDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: trackedEntity => ({
        trackedEntities: [trackedEntity],
    }),
};

const processErrorReports = (error) => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc, errorReport) => `${acc} ${errorReport.message}`, '')
        : error.message;
};

export const useDeleteTrackedEntity = (onSuccess?: () => void, onError?: (message: string) => void) => {
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
