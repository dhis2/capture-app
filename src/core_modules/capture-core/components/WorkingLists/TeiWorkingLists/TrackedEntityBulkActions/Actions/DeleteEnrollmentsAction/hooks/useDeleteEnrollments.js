// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { errorCreator } from '../../../../../../../../capture-core-utils';

type Props = {
    selectedRows: { [id: string]: boolean },
    programId: string,
    onUpdateList: () => void,
    setIsDeleteDialogOpen: (open: boolean) => void,
}

export const useDeleteEnrollments = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { data: enrollments, isLoading: isLoadingEnrollments } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'DeleteEnrollmentsAction', 'trackedEntities', selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: {
                fields: 'trackedEntity,enrollments[enrollment,program,status]',
                trackedEntities: Object.keys(selectedRows).join(','),
                program: programId,
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0,
            select: (data: any) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return [];

                return apiTrackedEntities
                    .flatMap(apiTrackedEntity => apiTrackedEntity.enrollments)
                    // fallback in case the api returns an enrollment in another program
                    .filter(enrollment => enrollment.program === programId);
            },
        },
    );

    const { mutate: deleteEnrollments, isLoading: isDeletingEnrollments } = useMutation<any>(
        ({ activeOnly }: any) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                enrollments: enrollments
                    // $FlowFixMe - business logic dictates that enrollments is not undefined at this point
                    .filter(({ status }) => !activeOnly || status === 'ACTIVE')
                    .map(({ enrollment }) => ({ enrollment })),
            },
        }),
        {
            onError: (error) => {
                log.error(errorCreator('An error occurred when deleting enrollments')({ error }));
                showAlert({ message: i18n.t('An error occurred when deleting enrollments') });
            },
            onSuccess: () => {
                onUpdateList();
                setIsDeleteDialogOpen(false);
            },
        },
    );

    const enrollmentCounts = useMemo(() => {
        if (!enrollments) {
            return null;
        }

        const { activeEnrollments, completedEnrollments } = enrollments.reduce((acc, enrollment) => {
            if (enrollment.status === 'ACTIVE') {
                acc.activeEnrollments += 1;
            } else {
                acc.completedEnrollments += 1;
            }

            return acc;
        }, { activeEnrollments: 0, completedEnrollments: 0 });

        return {
            active: activeEnrollments,
            completed: completedEnrollments,
            total: enrollments.length,
        };
    }, [enrollments]);

    return {
        deleteEnrollments,
        isDeletingEnrollments,
        isLoadingEnrollments,
        enrollmentCounts,
    };
};
