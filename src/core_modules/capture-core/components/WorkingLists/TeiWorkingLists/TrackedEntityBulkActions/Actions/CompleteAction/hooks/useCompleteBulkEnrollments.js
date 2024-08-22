// @flow

import { useMemo } from 'react';
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
                fields: 'trackedEntity,enrollments[enrollment,program,trackedEntity,orgUnit,status,occurredAt,enrolledAt]',
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
    } = useMutation<any>(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=UPDATE',
            type: 'create',
            data: {
                enrollments: trackedEntities?.activeEnrollments?.map(enrollment => ({
                    ...enrollment,
                    status: 'COMPLETED',
                })),
            },
        }),
        {
            onSuccess: () => {
                setModalIsOpen(false);
                onUpdateList();
            },
            onError: (error) => {
                showAlert({ message: i18n.t('An error occurred while completing the enrollments') });
                log.error(errorCreator('An error occurred while completing the enrollments')({ error }));
            },
        },
    );

    const enrollmentCounts = useMemo(() => ({
        active: trackedEntities?.activeEnrollments?.length ?? 0,
        completed: trackedEntities?.completedEnrollments?.length ?? 0,
    }), [trackedEntities]);

    return {
        completeEnrollments,
        enrollmentCounts,
        isLoading,
        isError,
        isCompletingEnrollments,
    };
};
