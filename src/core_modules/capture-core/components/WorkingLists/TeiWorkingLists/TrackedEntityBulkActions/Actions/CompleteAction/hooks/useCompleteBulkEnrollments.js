// @flow

import { useEffect, useMemo } from 'react';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from 'react-query';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { useApiDataQuery } from '../../../../../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../../../../../utils/api';
import { errorCreator } from '../../../../../../../../capture-core-utils';

type Props = {
    selectedRows: { [id: string]: any },
    programId: string,
    modalIsOpen: boolean,
    setModalIsOpen: (open: boolean) => void,
    onUpdateList: () => void,
}

export const useCompleteBulkEnrollments = ({
    selectedRows,
    programId,
    modalIsOpen,
    setModalIsOpen,
    onUpdateList,
}: Props) => {
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );
    const dataEngine = useDataEngine();

    const { data: trackedEntities, isError, isLoading } = useApiDataQuery(
        ['WorkingLists', 'BulkActionBar', 'CompleteAction', 'trackedEntities', selectedRows],
        {
            resource: 'tracker/trackedEntities',
            params: {
                program: programId,
                fields: 'trackedEntity,enrollments[enrollment,program,trackedEntity,orgUnit,status,occurredAt,enrolledAt,events[status,orgUnit,program,programStage,trackedEntity,occurredAt,event,scheduledAt]]',
                trackedEntities: Object.keys(selectedRows).join(','),
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
        mutate: completeEnrollments,
        isLoading: isCompletingEnrollments,
        error,
        reset: resetCompleteEnrollments,
    } = useMutation<any>(
        ({ completeEvents }: any) => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE&atomicMode=object',
            type: 'create',
            data: () => {
                const enrollments = trackedEntities?.activeEnrollments ?? [];
                let updatedEnrollments = enrollments.map(enrollment => ({
                    ...enrollment,
                    status: 'COMPLETED',
                }));

                if (completeEvents) {
                    updatedEnrollments = updatedEnrollments.map((enrollment) => {
                        const filteredEvents = enrollment.events.filter(event => event.status === 'ACTIVE');

                        if (filteredEvents.length === 0) {
                            return enrollment;
                        }

                        const updatedEvents = filteredEvents.map(event => ({
                            ...event,
                            status: 'COMPLETED',
                        }));

                        return {
                            ...enrollment,
                            events: updatedEvents,
                        };
                    });
                }

                return {
                    enrollments: updatedEnrollments,
                };
            },
        }),
        {
            onSuccess: () => {
                setModalIsOpen(false);
                onUpdateList();
            },
            onError: (serverError) => {
                showAlert({ message: i18n.t('An error occurred while completing the enrollments') });
                log.error(errorCreator('An error occurred while completing the enrollments')({ error: serverError }));
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

    return {
        completeEnrollments,
        enrollmentCounts,
        isLoading,
        isError,
        error,
        isCompletingEnrollments,
    };
};
