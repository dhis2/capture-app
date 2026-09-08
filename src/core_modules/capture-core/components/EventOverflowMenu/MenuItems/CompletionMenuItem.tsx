import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { MenuItem, IconCheckmark16, IconUndo16 } from '@dhis2/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useDispatch } from 'react-redux';
import { errorCreator } from 'capture-core-utils';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { removeEventChangelogQueries } from '../../WidgetsChangelog';
import { statusTypes as enrollmentStatuses } from '../../../enrollment';
import { CompleteModal } from '../../DataEntries/common/trackerEvent/withAskToCompleteEnrollment/CompleteModal';
import {
    updateEnrollmentAndEvents,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    setExternalEnrollmentStatus,
} from '../../Pages/common/EnrollmentOverviewDomain';

const updateEventStatus = async (
    dataEngine: any,
    eventId: string,
    targetStatus: string,
    extra?: { additionalEvents?: any[]; enrollment?: any },
) => {
    const { event: apiEvent } = await dataEngine.query({
        event: {
            resource: 'tracker/events',
            id: eventId,
            params: {
                fields: 'event,status,program,programStage,orgUnit,occurredAt,scheduledAt,'
                    + 'enrollment,trackedEntity,attributeOptionCombo,notes,assignedUser,geometry,followUp',
            },
        },
    }) as any;
    return dataEngine.mutate({
        resource: 'tracker?async=false&importStrategy=UPDATE',
        type: 'create',
        data: {
            events: [{ ...apiEvent, status: targetStatus }, ...(extra?.additionalEvents ?? [])],
            ...(extra?.enrollment && { enrollments: [extra.enrollment] }),
        },
    });
};

type MenuItemProps = {
    eventId: string;
    eventStatus?: string;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
    onClose: () => void;
    askCompleteEnrollmentOnEventComplete?: boolean;
    onAskCompleteEnrollment?: () => void;
};

export const CompletionMenuItem = ({
    eventId,
    eventStatus,
    onMutate,
    onSuccess,
    onError,
    onClose,
    askCompleteEnrollmentOnEventComplete,
    onAskCompleteEnrollment,
}: MenuItemProps) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showError } = useAlert(({ message }) => message, { critical: true });

    const isCompleted = eventStatus === eventStatuses.COMPLETED;
    const newStatus = isCompleted ? eventStatuses.ACTIVE : eventStatuses.COMPLETED;

    const { mutate: updateCompletionStatus } = useMutation(
        () => updateEventStatus(dataEngine, eventId, newStatus),
        {
            onMutate: () => onMutate?.(newStatus),
            onError: (error) => {
                showError({ message: i18n.t('An error occurred when updating event status') });
                log.error(errorCreator('An error occurred when updating event status')({ error, eventId, newStatus }));
                onError?.();
            },
            onSuccess: () => {
                removeEventChangelogQueries(queryClient, eventId);
                onSuccess?.(newStatus);
            },
        },
    );

    return (
        <MenuItem
            dense
            dataTest={isCompleted ? 'uncomplete-event-menu-item' : 'complete-event-menu-item'}
            icon={isCompleted ? <IconUndo16 /> : <IconCheckmark16 />}
            label={isCompleted ? i18n.t('Mark incomplete') : i18n.t('Mark complete')}
            suffix={null}
            onClick={() => {
                onClose();
                if (!isCompleted && askCompleteEnrollmentOnEventComplete && onAskCompleteEnrollment) {
                    onAskCompleteEnrollment();
                } else {
                    updateCompletionStatus();
                }
            }}
        />
    );
};

type ModalProps = {
    eventId: string;
    enrollment: any;
    programStageName?: string;
    onClose: () => void;
    onMutate?: (newStatus: string) => void;
    onSuccess?: (newStatus: string) => void;
    onError?: () => void;
};

export const CompleteMenuItemModal = ({
    eventId,
    enrollment,
    programStageName,
    onClose,
    onMutate,
    onSuccess,
    onError,
}: ModalProps) => {
    const dataEngine = useDataEngine();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { show: showError } = useAlert(({ message }) => message, { critical: true });

    const handleError = (error: unknown) => {
        showError({ message: i18n.t('An error occurred when updating event status') });
        log.error(errorCreator('An error occurred when updating event status')({ error, eventId }));
    };

    const { mutate: completeEventOnly } = useMutation(
        () => updateEventStatus(dataEngine, eventId, eventStatuses.COMPLETED),
        {
            onMutate: () => onMutate?.(eventStatuses.COMPLETED),
            onError: (error) => { handleError(error); onError?.(); },
            onSuccess: () => {
                removeEventChangelogQueries(queryClient, eventId);
                onSuccess?.(eventStatuses.COMPLETED);
            },
        },
    );

    const { mutate: completeEventAndEnrollment } = useMutation(
        (updatedEnrollment: any) => {
            const { events: additionalEvents = [], ...enrollmentPayload } = updatedEnrollment;
            return updateEventStatus(dataEngine, eventId, eventStatuses.COMPLETED, {
                additionalEvents,
                enrollment: enrollmentPayload,
            });
        },
        {
            onMutate: (updatedEnrollment) => {
                const currentEvent = enrollment.events?.find((e: any) => e.event === eventId) ?? {};
                dispatch(setExternalEnrollmentStatus(enrollmentStatuses.COMPLETED));
                dispatch(updateEnrollmentAndEvents({
                    ...updatedEnrollment,
                    events: [
                        { ...currentEvent, event: eventId, status: eventStatuses.COMPLETED },
                        ...(updatedEnrollment.events ?? []),
                    ],
                }));
            },
            onError: (error) => {
                handleError(error);
                dispatch(rollbackEnrollmentAndEvents());
                onError?.();
            },
            onSuccess: () => {
                dispatch(commitEnrollmentAndEvents());
                removeEventChangelogQueries(queryClient, eventId);
                onSuccess?.(eventStatuses.COMPLETED);
            },
        },
    );

    const events = enrollment.events ?? [];
    return (
        <CompleteModal
            programId={enrollment.program}
            eventId={eventId}
            enrollment={enrollment}
            events={events}
            hasActiveEvents={events.some((event: any) => event.status === eventStatuses.ACTIVE)}
            programStageName={programStageName ?? ''}
            onCancel={() => { onClose(); completeEventOnly(); }}
            onCompleteEnrollment={(updated: any) => { onClose(); completeEventAndEnrollment(updated); }}
        />
    );
};
