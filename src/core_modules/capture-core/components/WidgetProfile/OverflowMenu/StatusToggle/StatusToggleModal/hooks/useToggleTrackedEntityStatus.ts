import { useDataMutation } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';

const trackedEntityStatusUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: ({ trackedEntity, nextInactive }: { trackedEntity: any; nextInactive: boolean }) => ({
        trackedEntities: [{ ...trackedEntity, inactive: nextInactive }],
    }),
} as const;

const processErrorReports = (error: any): Array<{ message: string; uid: string }> => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0 ? errorReports : [{ uid: uuid(), message: error.message }];
};

export const useToggleTrackedEntityStatus = (
    onSuccess?: () => void,
    onError?: (errorReports: Array<{ message: string; uid: string }>) => void,
) => {
    const [toggleMutation, { loading: toggleLoading }] = useDataMutation(trackedEntityStatusUpdate, {
        onComplete: () => {
            onSuccess && onSuccess();
        },
        onError: (e) => {
            onError && onError(processErrorReports(e));
        },
    });
    return { toggleMutation, toggleLoading };
};
