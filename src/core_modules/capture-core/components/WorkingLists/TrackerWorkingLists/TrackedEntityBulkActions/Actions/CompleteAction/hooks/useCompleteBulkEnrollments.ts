import { useEffect, useMemo } from 'react';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { ReactQueryAppNamespace, useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { errorCreator, FEATURES, featureAvailable } from '../../../../../../../../capture-core-utils';
import type { ProgramStage } from '../../../../../../../metaData';

type Props = {
    selectedRows: Record<string, any>;
    programId: string;
    stages: Map<string, ProgramStage>;
    modalIsOpen: boolean;
    onUpdateList: (disableClearSelections?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
};

const validateEnrollments = async ({ dataEngine, enrollments }) => dataEngine.mutate({
    resource: 'tracker?async=false&importStrategy=UPDATE&importMode=VALIDATE',
    type: 'create',
    data: () => ({ enrollments }),
});

const importValidEnrollments = async ({ dataEngine, enrollments }) => dataEngine.mutate({
    resource: 'tracker?async=false&importStrategy=UPDATE&importMode=COMMIT',
    type: 'create',
    data: () => ({ enrollments }),
});

const formatServerPayload = (trackedEntities, completeEvents, stages) => {
    const enrollments = trackedEntities?.activeEnrollments ?? [];
    let updatedEnrollments;

    if (completeEvents) {
        updatedEnrollments = enrollments.map(enrollment => ({
            ...enrollment,
            status: 'COMPLETED',
            events: enrollment.events
                .filter((event) => {
                    const access = stages.get(event.programStage)?.access?.data?.write;
                    const isEventActive = event.status === 'ACTIVE';
                    return access && isEventActive;
                })
                .map(event => ({ ...event, status: 'COMPLETED' })),
        }));
    } else {
        updatedEnrollments = enrollments.map(enrollment => ({
            ...enrollment,
            status: 'COMPLETED',
            events: [],
        }));
    }

    return updatedEnrollments;
};

const filterValidEnrollments = (enrollments, errors) => {
    const invalidEnrollments = new Set();

    errors.forEach((apiErrorMessage) => {
        if (apiErrorMessage.trackerType === 'ENROLLMENT') {
            invalidEnrollments.add(apiErrorMessage.uid);
        } else if (apiErrorMessage.trackerType === 'EVENT') {
            const invalidEnrollment = enrollments.find(enrollment =>
                enrollment.events.some(event => event.event === apiErrorMessage.uid),
            );

            if (invalidEnrollment) {
                invalidEnrollments.add(invalidEnrollment.enrollment);
            }
        }
    });

    return enrollments.filter(
        enrollment => !invalidEnrollments.has(enrollment.enrollment),
    );
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

    const removeQueries = () => {
        queryClient.removeQueries(
            [
                ReactQueryAppNamespace,
                'WorkingLists',
                'BulkActionBar',
                'CompleteAction',
                'trackedEntities',
            ],
        );
    };

    const {
        data: trackedEntities,
        isError: isTrackedEntitiesError,
        isLoading: isFetchingTrackedEntities,
    } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'trackedEntities', selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: () => {
                const supportForFeature = featureAvailable(FEATURES.newEntityFilterQueryParam);
                const filterQueryParam = supportForFeature ? 'trackedEntities' : 'trackedEntity';

                return ({
                    program: programId,
                    fields: `trackedEntity,enrollments[*,!attributes,!completedBy,!completedAt,
                    !relationships,events[*,!dataValues,!completedAt,!completedBy,!relationships]]`,
                    [filterQueryParam]: Object.keys(selectedRows).join(supportForFeature ? ',' : ';'),
                    pageSize: 100,
                });
            },
        },
        {
            enabled: modalIsOpen && Object.keys(selectedRows).length > 0,
            select: (data: any) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, data);
                if (!apiTrackedEntities) return null;

                const { activeEnrollments, completedEnrollments } = apiTrackedEntities
                    .flatMap(trackedEntity => trackedEntity.enrollments)
                    .reduce((acc, enrollment) => {
                        if (enrollment.status === 'ACTIVE') {
                            acc.activeEnrollments.push(enrollment);
                        } else {
                            acc.completedEnrollments.push(enrollment);
                        }

                        return acc;
                    }, { activeEnrollments: [], completedEnrollments: [] });

                return {
                    activeEnrollments,
                    completedEnrollments,
                };
            },
        },
    );

    const {
        mutate: importEnrollments,
        isLoading: isImportingEnrollments,
    } = useMutation<any>(
        ({ enrollments }: any) => importValidEnrollments({ dataEngine, enrollments }),
        {
            onSuccess: () => {
                onUpdateList();
                removeQueries();
            },
            onError: (serverResponse, variables) => {
                removeQueries();
                showAlert({ message: i18n.t('An error occurred when completing the enrollments') });
                log.error(
                    errorCreator('An error occurred when completing enrollments')({
                        serverResponse,
                        variables,
                    }),
                );
            },
        },
    );

    const {
        mutate: importPartialEnrollments,
        isLoading: isImportingPartialEnrollments,
        isSuccess: hasPartiallyUploadedEnrollments,
    } = useMutation(
        ({ enrollments }: any) => importValidEnrollments({ dataEngine, enrollments }),
        {
            onSuccess: (serverResponse, { enrollments }) => {
                const enrollmentIds = enrollments.map(enrollment => enrollment.trackedEntity);
                removeRowsFromSelection(enrollmentIds);
                removeQueries();
                onUpdateList(true);
            },
            onError: (serverResponse, variables) => {
                showAlert({ message: i18n.t('An error occurred when completing the enrollments') });
                log.error(
                    errorCreator('An error occurred when completing enrollments')({
                        serverResponse,
                        variables,
                    }),
                );
            },
        },
    );

    const {
        mutate: onValidateEnrollments,
        isLoading: isCompletingEnrollments,
        error: validationError,
        reset: resetCompleteEnrollments,
    } = useMutation<any>(
        ({ enrollments }: any) => validateEnrollments({
            dataEngine,
            enrollments,
        }),
        {
            onSuccess: (serverResponse: any, { enrollments }: any) => {
                importEnrollments({ enrollments } as any);
            },
            onError: (serverResponse: any, { enrollments }: any) => {
                const errors = serverResponse?.details?.validationReport?.errorReports;
                if (!errors) {
                    log.error(
                        errorCreator('An unknown error occurred when completing enrollments',
                        )({
                            serverResponse,
                            enrollments,
                        }));
                    showAlert({ message: i18n.t('An unknown error occurred when completing enrollments') });
                    return;
                }
                const validEnrollments = filterValidEnrollments(enrollments, errors);

                if (validEnrollments.length === 0) {
                    return;
                }

                importPartialEnrollments({ enrollments: validEnrollments });
            },
        },
    );

    const enrollmentCounts = useMemo(() => ({
        active: trackedEntities?.activeEnrollments?.length ?? 0,
        completed: trackedEntities?.completedEnrollments?.length ?? 0,
    }), [trackedEntities]);

    useEffect(() => {
        if (!modalIsOpen) {
            resetCompleteEnrollments();
        }
    }, [modalIsOpen, resetCompleteEnrollments]);

    const onStartCompleteEnrollments = ({ completeEvents }: { completeEvents: boolean }) => {
        const enrollments = formatServerPayload(trackedEntities, completeEvents, stages);
        onValidateEnrollments({ completeEvents, enrollments } as any);
    };

    return {
        completeEnrollments: onStartCompleteEnrollments,
        enrollmentCounts,
        isLoading: isFetchingTrackedEntities,
        isError: isTrackedEntitiesError,
        validationError,
        isCompleting: isImportingEnrollments || isImportingPartialEnrollments || isCompletingEnrollments,
        hasPartiallyUploadedEnrollments,
    };
};
