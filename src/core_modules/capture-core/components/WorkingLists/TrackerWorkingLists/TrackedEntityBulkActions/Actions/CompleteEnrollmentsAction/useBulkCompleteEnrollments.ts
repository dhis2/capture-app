import { useCallback, useEffect, useMemo } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../utils/api';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../utils/reactQueryHelpers';
import { useBulkMutationWithValidation } from '../../../../WorkingListsCommon/BulkActionBar/hooks';
import type { ErrorReport, ValidationReportContainer } from '../../../../WorkingListsCommon/BulkActionBar/types';
import type { ProgramStage } from '../../../../../../metaData';

type Enrollment = {
    enrollment: string;
    trackedEntity: string;
    status?: string;
    events?: Array<{ event: string; programStage: string; status?: string; [key: string]: any }>;
    [key: string]: any;
};

type Props = {
    selectedRows: Record<string, boolean>;
    programId: string;
    stages: Map<string, ProgramStage>;
    isModalOpen: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsModalOpen: (open: boolean) => void;
};

const QueryKey = ['WorkingLists', 'BulkActionBar', 'CompleteEnrollmentsAction', 'trackedEntities'];

const validateEnrollments = async ({ dataEngine, enrollments }: { dataEngine: any; enrollments: Enrollment[] }) =>
    dataEngine.mutate({
        resource: 'tracker?async=false&importStrategy=UPDATE&importMode=VALIDATE',
        type: 'create',
        data: () => ({ enrollments }),
    });

const importValidEnrollments = async ({ dataEngine, enrollments }: { dataEngine: any; enrollments: Enrollment[] }) =>
    dataEngine.mutate({
        resource: 'tracker?async=false&importStrategy=UPDATE&importMode=COMMIT',
        type: 'create',
        data: () => ({ enrollments }),
    });

const formatServerPayload = (
    trackedEntities: any,
    completeEvents: boolean,
    stages: Map<string, ProgramStage>,
): Enrollment[] => {
    const enrollments: Enrollment[] = trackedEntities?.activeEnrollments ?? [];

    if (completeEvents) {
        return enrollments.map(enrollment => ({
            ...enrollment,
            status: 'COMPLETED',
            events: (enrollment.events ?? [])
                .filter((event) => {
                    const access = stages.get(event.programStage)?.access?.data?.write;
                    const isEventActive = event.status === 'ACTIVE';
                    return access && isEventActive;
                })
                .map(event => ({ ...event, status: 'COMPLETED' })),
        }));
    }

    return enrollments.map(enrollment => ({
        ...enrollment,
        status: 'COMPLETED',
        events: [],
    }));
};

const bucketEnrollmentsByStatus = (apiTrackedEntities: any[]): {
    activeEnrollments: Enrollment[];
    completedEnrollments: Enrollment[];
} => apiTrackedEntities
    .flatMap((trackedEntity: any) => trackedEntity.enrollments)
    .reduce(
        (acc, enrollment: Enrollment) => {
            if (enrollment.status === 'ACTIVE') acc.activeEnrollments.push(enrollment);
            else acc.completedEnrollments.push(enrollment);
            return acc;
        },
        { activeEnrollments: [] as Enrollment[], completedEnrollments: [] as Enrollment[] },
    );

const findInvalidEnrollmentIdForError = (
    errorReport: ErrorReport,
    enrollments: Enrollment[],
): string | null => {
    if (errorReport.trackerType === 'ENROLLMENT') return errorReport.uid;
    if (errorReport.trackerType === 'EVENT') {
        const parent = enrollments.find(e =>
            e.events?.some(event => event.event === errorReport.uid),
        );
        return parent?.enrollment ?? null;
    }
    return null;
};

const filterValidEnrollments = (enrollments: Enrollment[], errors: ErrorReport[]): Enrollment[] | null => {
    const invalidEnrollmentIds = errors.reduce<Set<string> | null>((acc, errorReport) => {
        if (acc === null) return null;
        const invalidId = findInvalidEnrollmentIdForError(errorReport, enrollments);
        if (invalidId === null) return null;
        acc.add(invalidId);
        return acc;
    }, new Set<string>());

    if (invalidEnrollmentIds === null) return null;
    return enrollments.filter(enrollment => !invalidEnrollmentIds.has(enrollment.enrollment));
};


export const useBulkCompleteEnrollments = ({
    selectedRows,
    programId,
    stages,
    isModalOpen,
    removeRowsFromSelection,
    onUpdateList,
    setIsModalOpen,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const removeQueries = useCallback(() => {
        queryClient.removeQueries([ReactQueryAppNamespace, ...QueryKey]);
    }, [queryClient]);

    const {
        data: trackedEntities,
        isError: isTrackedEntitiesError,
        isInitialLoading: isInitialLoadingTrackedEntities,
    } = useApiDataQuery(
        [...QueryKey, selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: () => ({
                program: programId,
                fields: 'trackedEntity,enrollments[*,!attributes,!completedBy,!completedAt,!relationships,' +
                        'events[*,!dataValues,!completedAt,!completedBy,!relationships]]',
                trackedEntities: Object.keys(selectedRows).join(','),
                pageSize: 100,
            }),
        },
        {
            enabled: isModalOpen && Object.keys(selectedRows).length > 0,
            select: (data: any) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return null;
                return bucketEnrollmentsByStatus(apiTrackedEntities);
            },
        },
    );

    const {
        mutate: importEnrollments,
        isPending: isImportingEnrollments,
    } = useMutation(
        ({ enrollments }: { enrollments: Enrollment[] }) => importValidEnrollments({ dataEngine, enrollments }),
        {
            onSuccess: () => {
                onUpdateList();
                removeQueries();
                setIsModalOpen(false);
            },
            onError: (serverResponse, variables) => {
                removeQueries();
                showAlert({ message: i18n.t('An error occurred when completing the enrollments') });
                log.error(errorCreator('An error occurred when completing enrollments')({
                    serverResponse, variables,
                }));
            },
        },
    );

    const {
        mutate: importPartialEnrollments,
        isPending: isImportingPartialEnrollments,
        isSuccess: hasPartiallyUploadedEnrollments,
        reset: resetPartialImport,
    } = useMutation(
        ({ enrollments }: { enrollments: Enrollment[] }) => importValidEnrollments({ dataEngine, enrollments }),
        {
            onSuccess: (_response, { enrollments }) => {
                const enrollmentIds = enrollments.map(enrollment => enrollment.trackedEntity);
                removeRowsFromSelection(enrollmentIds);
                removeQueries();
                onUpdateList(true);
            },
            onError: (serverResponse, variables) => {
                showAlert({ message: i18n.t('An error occurred when completing the enrollments') });
                log.error(errorCreator('An error occurred when completing enrollments')({
                    serverResponse, variables,
                }));
            },
        },
    );

    useEffect(() => {
        if (!isModalOpen) resetPartialImport();
    }, [isModalOpen, resetPartialImport]);

    const validateMutationFn = useCallback(
        ({ enrollments }: { enrollments: Enrollment[] }) =>
            validateEnrollments({ dataEngine, enrollments }) as Promise<any>,
        [dataEngine],
    );

    const importValidSubset = (
        report: ValidationReportContainer,
        { enrollments }: { enrollments: Enrollment[] },
    ) => {
        const validEnrollments = filterValidEnrollments(enrollments, report.validationReport.errorReports);
        if (!validEnrollments || validEnrollments.length === 0) return;
        importPartialEnrollments({ enrollments: validEnrollments });
    };

    const {
        mutate: validateAndImportEnrollments,
        isPending: isValidatingEnrollments,
        validationError,
    } = useBulkMutationWithValidation<any, { enrollments: Enrollment[] }>({
        mutationFn: validateMutationFn,
        active: isModalOpen,
        onSuccess: (_response, { enrollments }) => {
            importEnrollments({ enrollments });
        },
        onPartialSuccess: importValidSubset,
        onValidationError: (report, variables) => {
            log.error(errorCreator('A validation error occurred when completing enrollments')({ report }));
            importValidSubset(report, variables);
        },
        onFatalError: (error, { enrollments }) => {
            log.error(errorCreator('An unknown error occurred when completing enrollments')({
                error, enrollments,
            }));
            showAlert({ message: i18n.t('An unknown error occurred when completing enrollments') });
        },
    });

    const enrollmentCounts = useMemo(() => ({
        active: trackedEntities?.activeEnrollments?.length ?? 0,
        completed: trackedEntities?.completedEnrollments?.length ?? 0,
    }), [trackedEntities]);

    const enrollmentIdToTeiId = useMemo(() => {
        const allEnrollments: Enrollment[] = [
            ...(trackedEntities?.activeEnrollments ?? []),
            ...(trackedEntities?.completedEnrollments ?? []),
        ];
        return allEnrollments.reduce<Record<string, string>>((acc, enrollment) => {
            acc[enrollment.enrollment] = enrollment.trackedEntity;
            return acc;
        }, {});
    }, [trackedEntities]);

    const completeEnrollments = useCallback(({ completeEvents }: { completeEvents: boolean }) => {
        const enrollments = formatServerPayload(trackedEntities, completeEvents, stages);
        validateAndImportEnrollments({ enrollments });
    }, [trackedEntities, stages, validateAndImportEnrollments]);

    return {
        completeEnrollments,
        isPending: isImportingEnrollments || isImportingPartialEnrollments || isValidatingEnrollments,
        isLoading: isInitialLoadingTrackedEntities,
        isError: isTrackedEntitiesError,
        validationError,
        enrollmentCounts,
        enrollmentIdToTeiId,
        hasPartiallyUploadedEnrollments,
    };
};
