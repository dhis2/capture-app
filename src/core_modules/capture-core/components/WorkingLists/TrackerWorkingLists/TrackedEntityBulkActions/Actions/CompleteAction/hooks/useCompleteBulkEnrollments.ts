import { useCallback, useMemo } from 'react';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';
import type { ErrorReport, ValidationReportContainer } from '../../../../../WorkingListsCommon/BulkActionBar/types';
import type { ProgramStage } from '../../../../../../../metaData';

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
    modalIsOpen: boolean;
    onUpdateList: (disableClearSelections?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
};

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

const filterValidEnrollments = (enrollments: Enrollment[], errors: ErrorReport[]): Enrollment[] => {
    const invalidEnrollments = new Set<string>();

    errors.forEach((errorReport) => {
        if (errorReport.trackerType === 'ENROLLMENT' && errorReport.uid) {
            invalidEnrollments.add(errorReport.uid);
        } else if (errorReport.trackerType === 'EVENT' && errorReport.uid) {
            const invalidEnrollment = enrollments.find(enrollment =>
                enrollment.events?.some(event => event.event === errorReport.uid),
            );
            if (invalidEnrollment) {
                invalidEnrollments.add(invalidEnrollment.enrollment);
            }
        }
    });

    return enrollments.filter(enrollment => !invalidEnrollments.has(enrollment.enrollment));
};


export const useCompleteBulkEnrollments = ({
    selectedRows,
    programId,
    stages,
    modalIsOpen,
    removeRowsFromSelection,
    onUpdateList,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const removeQueries = useCallback(() => {
        queryClient.removeQueries([
            ReactQueryAppNamespace,
            'WorkingLists', 'BulkActionBar', 'CompleteAction', 'trackedEntities',
        ]);
    }, [queryClient]);

    const {
        data: trackedEntities,
        isError: isTrackedEntitiesError,
        isInitialLoading: isInitialLoadingTrackedEntities,
    } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'trackedEntities', selectedRows],
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
            enabled: modalIsOpen && Object.keys(selectedRows).length > 0,
            select: (data: any) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return null;

                return apiTrackedEntities
                    .flatMap((trackedEntity: any) => trackedEntity.enrollments)
                    .reduce((acc: { activeEnrollments: Enrollment[]; completedEnrollments: Enrollment[] },
                        enrollment: Enrollment) => {
                        if (enrollment.status === 'ACTIVE') {
                            acc.activeEnrollments.push(enrollment);
                        } else {
                            acc.completedEnrollments.push(enrollment);
                        }
                        return acc;
                    }, { activeEnrollments: [], completedEnrollments: [] });
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

    const validateMutationFn = useCallback(
        ({ enrollments }: { enrollments: Enrollment[] }) =>
            validateEnrollments({ dataEngine, enrollments }) as Promise<any>,
        [dataEngine],
    );

    const importValidSubset = (
        report: ValidationReportContainer,
        { enrollments }: { enrollments: Enrollment[] },
    ) => {
        const validEnrollments = filterValidEnrollments(
            enrollments,
            report.validationReport.errorReports,
        );
        if (validEnrollments.length === 0) return;
        importPartialEnrollments({ enrollments: validEnrollments });
    };

    const {
        mutate: validateAndImportEnrollments,
        isPending: isValidatingEnrollments,
        validationError,
    } = useBulkMutationWithValidation<any, { enrollments: Enrollment[] }>({
        mutationFn: validateMutationFn,
        active: modalIsOpen,
        onSuccess: (_response, { enrollments }) => {
            importEnrollments({ enrollments });
        },
        onPartialSuccess: importValidSubset,
        onValidationError: importValidSubset,
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
            if (enrollment?.enrollment && enrollment?.trackedEntity) {
                acc[enrollment.enrollment] = enrollment.trackedEntity;
            }
            return acc;
        }, {});
    }, [trackedEntities]);

    const knownEventUids = useMemo(() => {
        const set = new Set<string>();
        (trackedEntities?.activeEnrollments ?? []).forEach((enrollment: Enrollment) => {
            (enrollment.events ?? []).forEach((event) => {
                if (event.event) set.add(event.event);
            });
        });
        return set;
    }, [trackedEntities]);

    const onStartCompleteEnrollments = useCallback(({ completeEvents }: { completeEvents: boolean }) => {
        const enrollments = formatServerPayload(trackedEntities, completeEvents, stages);
        validateAndImportEnrollments({ enrollments });
    }, [trackedEntities, stages, validateAndImportEnrollments]);

    return {
        completeEnrollments: onStartCompleteEnrollments,
        enrollmentCounts,
        enrollmentIdToTeiId,
        knownEventUids,
        isLoading: isInitialLoadingTrackedEntities,
        isError: isTrackedEntitiesError,
        validationError,
        isCompleting: isImportingEnrollments || isImportingPartialEnrollments || isValidatingEnrollments,
        hasPartiallyUploadedEnrollments,
    };
};
