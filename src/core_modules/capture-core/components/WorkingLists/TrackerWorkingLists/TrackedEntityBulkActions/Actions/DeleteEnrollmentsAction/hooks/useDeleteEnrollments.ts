import { useCallback, useMemo, useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation, useQueryClient } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { errorCreator, FEATURES, featureAvailable } from '../../../../../../../../capture-core-utils';

type Props = {
    selectedRows: Record<string, boolean>;
    programId: string;
    onUpdateList: () => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
};

const QueryKey = ['WorkingLists', 'BulkActionBar', 'DeleteEnrollmentsAction', 'trackedEntities'];

export const useDeleteEnrollments = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
}: Props) => {
    const queryClient = useQueryClient();
    const [statusToDelete, setStatusToDelete] = useState({
        active: true,
        completed: true,
        cancelled: true,
    });
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const updateStatusToDelete = useCallback((status: string) => {
        setStatusToDelete(prevStatus => ({
            ...prevStatus,
            [status]: !prevStatus[status],
        }));
    }, []);

    const {
        data: enrollments,
        isLoading: isLoadingEnrollments,
        isError: isEnrollmentsError,
    } = useApiDataQuery(
        [...QueryKey, selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: () => {
                const supportForFeature = featureAvailable(FEATURES.newEntityFilterQueryParam);
                const filterQueryParam = supportForFeature ? 'trackedEntities' : 'trackedEntity';

                return ({
                    fields: 'trackedEntity,enrollments[enrollment,program,status]',
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                    pageSize: 100,
                    program: programId,
                });
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0,
            select: (data: any) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return [];

                return apiTrackedEntities
                    .flatMap(apiTrackedEntity => apiTrackedEntity.enrollments);
            },
        },
    );

    const { mutate: deleteEnrollments, isLoading: isDeletingEnrollments } = useMutation<any>(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                enrollments: enrollments
                    // $FlowFixMe - business logic dictates that enrollments is not undefined at this point
                    .filter(({ status }) => status && statusToDelete[status.toLowerCase()])
                    .map(({ enrollment }) => ({ enrollment })),
            },
        }),
        {
            onError: (error) => {
                log.error(errorCreator('An error occurred when deleting enrollments')({ error }));
                showAlert({ message: i18n.t('An error occurred when deleting enrollments') });
            },
            onSuccess: () => {
                queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
                onUpdateList();
                setIsDeleteDialogOpen(false);
            },
        },
    );

    const enrollmentCounts = useMemo(() => {
        if (!enrollments) {
            return null;
        }

        const {
            activeEnrollments,
            completedEnrollments,
            cancelledEnrollments,
        } = enrollments.reduce((acc, enrollment) => {
            if (enrollment.status === 'ACTIVE') {
                acc.activeEnrollments += 1;
            } else if (enrollment.status === 'CANCELLED') {
                acc.cancelledEnrollments += 1;
            } else {
                acc.completedEnrollments += 1;
            }

            return acc;
        }, { activeEnrollments: 0, completedEnrollments: 0, cancelledEnrollments: 0 });

        return {
            active: activeEnrollments,
            completed: completedEnrollments,
            cancelled: cancelledEnrollments,
            total: enrollments.length,
        };
    }, [enrollments]);

    const numberOfEnrollmentsToDelete = useMemo(() => {
        if (!enrollments || !enrollmentCounts) {
            return 0;
        }

        let total = 0;
        if (statusToDelete.active) {
            total += enrollmentCounts.active;
        }
        if (statusToDelete.completed) {
            total += enrollmentCounts.completed;
        }
        if (statusToDelete.cancelled) {
            total += enrollmentCounts.cancelled;
        }

        return total;
    }, [enrollments, enrollmentCounts, statusToDelete]);

    return {
        deleteEnrollments,
        isDeletingEnrollments,
        isLoadingEnrollments,
        isEnrollmentsError,
        enrollmentCounts,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
    };
};
