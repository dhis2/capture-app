import { useCallback, useMemo, useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator, FEATURES, featureAvailable } from 'capture-core-utils';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';

type Enrollment = {
    enrollment: string;
    program?: string;
    status?: string;
    trackedEntity: string;
};

type StatusToDelete = { active: boolean; completed: boolean; cancelled: boolean };

type Props = {
    selectedRows: Record<string, boolean>;
    programId: string;
    active: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
};

const QueryKey = ['WorkingLists', 'BulkActionBar', 'DeleteEnrollmentsAction', 'trackedEntities'];

const findFullyDeletedTeiIds = (
    enrollments: Enrollment[],
    statusToDelete: StatusToDelete,
    failedEnrollmentUids: Set<string>,
): string[] => {
    const wasDeleted = ({ enrollment, status }: Enrollment) => {
        const key = status?.toLowerCase();
        if (!key || !(key in statusToDelete)) return false;
        return statusToDelete[key as keyof StatusToDelete] && !failedEnrollmentUids.has(enrollment);
    };
    const grouped = enrollments.reduce<Record<string, Enrollment[]>>((acc, e) => ({
        ...acc,
        [e.trackedEntity]: [...(acc[e.trackedEntity] ?? []), e],
    }), {});
    return Object.entries(grouped)
        .filter(([, teiEnrollments]) => teiEnrollments.every(wasDeleted))
        .map(([teiId]) => teiId);
};

export const useDeleteEnrollments = ({
    selectedRows,
    programId,
    active,
    onUpdateList,
    removeRowsFromSelection,
    setIsDeleteDialogOpen,
}: Props) => {
    const queryClient = useQueryClient();
    const [statusToDelete, setStatusToDelete] = useState<StatusToDelete>({
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
            [status]: !prevStatus[status as keyof StatusToDelete],
        }));
    }, []);

    const {
        data: enrollments,
        isInitialLoading: isInitialLoadingEnrollments,
        isError: isEnrollmentsError,
    } = useApiDataQuery(
        [...QueryKey, selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: () => {
                const supportForFeature = featureAvailable(FEATURES.newEntityFilterQueryParam);
                const filterQueryParam = supportForFeature ? 'trackedEntities' : 'trackedEntity';

                return ({
                    fields: 'trackedEntity,enrollments[enrollment,program,status,trackedEntity]',
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                    pageSize: 100,
                    program: programId,
                });
            },
        },
        {
            enabled: Object.keys(selectedRows).length > 0,
            select: (data: any): Enrollment[] => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return [];

                return apiTrackedEntities.flatMap((apiTrackedEntity: any) =>
                    (apiTrackedEntity.enrollments ?? []).map((enrollment: Enrollment) => ({
                        ...enrollment,
                        trackedEntity: enrollment.trackedEntity ?? apiTrackedEntity.trackedEntity,
                    })));
            },
        },
    );

    const mutationFn = useCallback(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                enrollments: (enrollments ?? [])
                    .filter(({ status }) => status && statusToDelete[status.toLowerCase() as keyof StatusToDelete])
                    .map(({ enrollment }) => ({ enrollment })),
            },
        }) as Promise<any>,
        [dataEngine, enrollments, statusToDelete],
    );

    const {
        mutate: deleteEnrollments,
        isPending: isDeletingEnrollments,
        validationError,
    } = useBulkMutationWithValidation<any, void>({
        mutationFn,
        active,
        onSuccess: () => {
            queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
            onUpdateList();
            setIsDeleteDialogOpen(false);
        },
        onPartialSuccess: (report) => {
            const failedEnrollmentUids = new Set(
                report.validationReport.errorReports.map(e => e.uid).filter(Boolean) as string[],
            );
            const fullyDeletedTeiIds = findFullyDeletedTeiIds(
                enrollments ?? [], statusToDelete, failedEnrollmentUids,
            );
            removeRowsFromSelection(fullyDeletedTeiIds);
            queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
            onUpdateList(true);
        },
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred when deleting enrollments')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred when deleting enrollments') });
        },
    });

    const enrollmentIdToTeiId = useMemo(() => {
        const map: Record<string, string> = {};
        (enrollments ?? []).forEach((enrollment) => {
            if (enrollment.enrollment && enrollment.trackedEntity) {
                map[enrollment.enrollment] = enrollment.trackedEntity;
            }
        });
        return map;
    }, [enrollments]);

    const enrollmentCounts = useMemo(() => {
        if (!enrollments) return null;

        const counts = enrollments.reduce((acc, enrollment) => {
            if (enrollment.status === 'ACTIVE') acc.active += 1;
            else if (enrollment.status === 'CANCELLED') acc.cancelled += 1;
            else acc.completed += 1;
            return acc;
        }, { active: 0, completed: 0, cancelled: 0 });

        return { ...counts, total: enrollments.length };
    }, [enrollments]);

    const numberOfEnrollmentsToDelete = useMemo(() => {
        if (!enrollmentCounts) return 0;
        return (['active', 'completed', 'cancelled'] as const)
            .filter(status => statusToDelete[status])
            .reduce((total, status) => total + enrollmentCounts[status], 0);
    }, [enrollmentCounts, statusToDelete]);

    return {
        deleteEnrollments,
        isDeletingEnrollments,
        isLoadingEnrollments: isInitialLoadingEnrollments,
        isEnrollmentsError,
        enrollmentCounts,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
        validationError,
        enrollmentIdToTeiId,
    };
};
