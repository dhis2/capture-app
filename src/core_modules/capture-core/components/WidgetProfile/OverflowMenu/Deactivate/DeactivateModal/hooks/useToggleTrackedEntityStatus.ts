import { useDataMutation } from '@dhis2/app-runtime';
import { v4 as uuid } from 'uuid';

type TrackedEntityPayload = {
    trackedEntity: string;
    trackedEntityType: string;
    orgUnit: string;
    inactive: boolean;
};

const trackedEntityUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (trackedEntity: TrackedEntityPayload) => ({
        trackedEntities: [trackedEntity],
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
    const [toggleMutation, { loading }] = useDataMutation(trackedEntityUpdate, {
        onComplete: () => {
            onSuccess && onSuccess();
        },
        onError: (e) => {
            onError && onError(processErrorReports(e));
        },
    });
    return { toggleMutation, loading };
};
