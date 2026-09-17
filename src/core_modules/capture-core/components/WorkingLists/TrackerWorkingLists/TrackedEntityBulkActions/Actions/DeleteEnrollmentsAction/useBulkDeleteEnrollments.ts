import { useCallback, useEffect, useMemo, useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../utils/api';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../utils/reactQueryHelpers';
import { useBulkMutationWithValidation } from '../../../../WorkingListsCommon/BulkActionBar/hooks';

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
    isModalOpen: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsModalOpen: (open: boolean) => void;
};

const QueryKey = ['WorkingLists', 'BulkActionBar', 'DeleteEnrollmentsAction', 'trackedEntities'];

const flattenEnrollmentsFromTrackedEntities = (apiTrackedEntities: any[]): Enrollment[] =>
    apiTrackedEntities.flatMap((apiTrackedEntity: any) =>
        (apiTrackedEntity.enrollments ?? []).map((enrollment: Enrollment) => ({
            ...enrollment,
            trackedEntity: enrollment.trackedEntity ?? apiTrackedEntity.trackedEntity,
        })));

const buildEnrollmentIdToTeiIdMap = (enrollments: Enrollment[]): Record<string, string> => {
    const map: Record<string, string> = {};
    enrollments.forEach((enrollment) => {
        map[enrollment.enrollment] = enrollment.trackedEntity;
    });
    return map;
};

const countEnrollmentsByStatus = (enrollments: Enrollment[]) => {
    const counts = enrollments.reduce((acc, enrollment) => {
        if (enrollment.status === 'ACTIVE') acc.active += 1;
        else if (enrollment.status === 'CANCELLED') acc.cancelled += 1;
        else if (enrollment.status === 'COMPLETED') acc.completed += 1;
        return acc;
    }, { active: 0, completed: 0, cancelled: 0 });
    return { ...counts, total: counts.active + counts.completed + counts.cancelled };
};

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

export const useBulkDeleteEnrollments = ({
    selectedRows,
    programId,
    isModalOpen,
    onUpdateList,
    removeRowsFromSelection,
    setIsModalOpen,
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
            [status]: !prevStatus[status as keyof StatusToDelete],
        }));
    }, []);

    useEffect(() => {
        if (!isModalOpen) {
            setStatusToDelete({ active: true, completed: true, cancelled: true });
        }
    }, [isModalOpen]);

    const {
        data: enrollments,
        isInitialLoading: isInitialLoadingEnrollments,
        isError: isEnrollmentsError,
    } = useApiDataQuery(
        [...QueryKey, selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: () => ({
                fields: 'trackedEntity,enrollments[enrollment,program,status,trackedEntity]',
                trackedEntities: Object.keys(selectedRows).join(','),
                pageSize: 100,
                program: programId,
            }),
        },
        {
            enabled: isModalOpen && Object.keys(selectedRows).length > 0,
            select: (data: any): Enrollment[] => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return [];
                return flattenEnrollmentsFromTrackedEntities(apiTrackedEntities);
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
        isPending,
        validationError,
    } = useBulkMutationWithValidation<any, void>({
        mutationFn,
        active: isModalOpen,
        onSuccess: () => {
            queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
            onUpdateList();
            setIsModalOpen(false);
        },
        onPartialSuccess: (report) => {
            const failedEnrollmentUids = new Set(report.validationReport.errorReports.map(e => e.uid));
            const fullyDeletedTeiIds = findFullyDeletedTeiIds(
                enrollments ?? [], statusToDelete, failedEnrollmentUids,
            );
            removeRowsFromSelection(fullyDeletedTeiIds);
            queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
            onUpdateList(true);
        },
        onValidationError: (report) => {
            log.error(errorCreator('A validation error occurred when deleting enrollments')({ report }));
        },
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred when deleting enrollments')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred when deleting enrollments') });
        },
    });

    const enrollmentIdToTeiId = useMemo(
        () => buildEnrollmentIdToTeiIdMap(enrollments ?? []),
        [enrollments],
    );

    const enrollmentCounts = useMemo(
        () => (enrollments ? countEnrollmentsByStatus(enrollments) : null),
        [enrollments],
    );

    const numberOfEnrollmentsToDelete = useMemo(() => {
        if (!enrollmentCounts) return 0;
        return (['active', 'completed', 'cancelled'] as const)
            .filter(status => statusToDelete[status])
            .reduce((total, status) => total + enrollmentCounts[status], 0);
    }, [enrollmentCounts, statusToDelete]);

    return {
        deleteEnrollments,
        isPending,
        isLoading: isInitialLoadingEnrollments,
        isError: isEnrollmentsError,
        validationError,
        enrollmentCounts,
        enrollmentIdToTeiId,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
    };
};
