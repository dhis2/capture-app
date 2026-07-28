import React, { useState } from 'react';
import { FlyoutMenu, IconMore16 } from '@dhis2/ui';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { OverflowButton } from '../Buttons';
import { useEventEditPermissions, useCanChangeCompletionStatus } from '../../hooks';
import { EventCompletionMenuItem } from './EventCompletionMenuItem';
import { eventStatuses } from '../WidgetEventEdit/constants/status.const';
import { convertServerToClient } from '../../converters';
import { dataElementTypes, type ProgramStage } from '../../metaData';
import { SkipMenuItem } from './SkipMenuItem';
import { DeleteMenuItem, DeleteEventModal } from './DeleteMenuItem';
import { ChangelogMenuItem } from './ChangelogMenuItem';

type Props = {
    eventId: string;
    eventStatus?: string;
    occurredAt?: string;
    completedAt?: string;
    programId: string;
    programStage?: ProgramStage | null;
    pendingApiResponse?: boolean;

    /** Optional pre-delete snapshot; only needed when the caller wants delete-rollback. */
    eventDetailsForRollback?: ApiEnrollmentEvent;

    onCompletionStatusMutate?: (newStatus: string) => void;
    onCompletionStatusUpdated?: (newStatus: string) => void;
    onCompletionStatusError?: () => void;

    onOptimisticStatusUpdate?: (eventId: string, newStatus: string) => void;
    onStatusUpdateError?: (eventId: string, previousStatus: string) => void;
    onStatusUpdateSuccess?: (eventId: string, newStatus: string) => void;

    onOptimisticDelete?: (eventId: string) => void;
    onDeleteSuccess?: (eventId: string) => void;
    onDeleteError?: (event: ApiEnrollmentEvent) => void;

    onOpenChangelog?: () => void;

    dataTest?: string;
};

type Visibility = {
    completion: boolean;
    skip: boolean;
    delete: boolean;
    changelog: boolean;
    any: boolean;
};

const isSkippable = (status?: string) =>
    status === eventStatuses.SCHEDULE || status === eventStatuses.SKIPPED;

const hasHandler = (...handlers: Array<unknown>) => handlers.some(Boolean);

const computeVisibility = (props: Props, ctx: {
    canChangeCompletionStatus: boolean;
    canWrite: boolean;
}): Visibility => {
    const completion = ctx.canChangeCompletionStatus && hasHandler(props.onCompletionStatusUpdated);
    const skip = ctx.canWrite
        && isSkippable(props.eventStatus)
        && hasHandler(props.onOptimisticStatusUpdate, props.onStatusUpdateSuccess);
    const del = ctx.canWrite && hasHandler(props.onOptimisticDelete, props.onDeleteSuccess);
    const changelog = hasHandler(props.onOpenChangelog);
    return { completion, skip, delete: del, changelog, any: [completion, skip, del, changelog].some(Boolean) };
};

export const EventOverflowMenu = (props: Props) => {
    const {
        eventId,
        eventStatus,
        occurredAt,
        completedAt,
        programId,
        programStage,
        pendingApiResponse,
        eventDetailsForRollback,
        onCompletionStatusMutate,
        onCompletionStatusUpdated,
        onCompletionStatusError,
        onOptimisticStatusUpdate,
        onStatusUpdateError,
        onStatusUpdateSuccess,
        onOptimisticDelete,
        onDeleteSuccess,
        onDeleteError,
        onOpenChangelog,
        dataTest = 'event-overflow-menu',
    } = props;

    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const occurredAtClient = convertServerToClient(occurredAt, dataElementTypes.DATE) as string;
    const completedAtClient = convertServerToClient(completedAt, dataElementTypes.DATE) as string;
    const {
        eventAccess,
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        readOnly,
    } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus,
        occurredAtClient,
        completedAtClient,
    });
    const canChangeCompletionStatus = useCanChangeCompletionStatus({
        programId,
        stage: programStage,
        eventStatus,
    });

    const visibility = computeVisibility(props, {
        canChangeCompletionStatus,
        canWrite: !!eventAccess?.write,
    });

    if (!visibility.any) {
        return null;
    }

    const close = () => setActionsOpen(false);

    return (
        <>
            <OverflowButton
                open={actionsOpen}
                onClick={() => setActionsOpen(prev => !prev)}
                secondary
                small
                icon={<IconMore16 />}
                dataTest={`${dataTest}-button`}
                disabled={pendingApiResponse}
                component={(
                    <FlyoutMenu dense maxWidth="250px" dataTest={dataTest}>
                        {visibility.completion && onCompletionStatusUpdated && (
                            <EventCompletionMenuItem
                                eventId={eventId}
                                eventStatus={eventStatus}
                                onMutate={onCompletionStatusMutate}
                                onUpdated={onCompletionStatusUpdated}
                                onError={onCompletionStatusError}
                                onClose={close}
                            />
                        )}
                        {visibility.skip && (
                            <SkipMenuItem
                                eventId={eventId}
                                eventStatus={eventStatus}
                                pendingApiResponse={pendingApiResponse}
                                onClose={close}
                                onOptimisticStatusUpdate={onOptimisticStatusUpdate}
                                onStatusUpdateError={onStatusUpdateError}
                                onStatusUpdateSuccess={onStatusUpdateSuccess}
                            />
                        )}
                        {visibility.changelog && onOpenChangelog && (
                            <ChangelogMenuItem
                                onClose={close}
                                onOpenChangelog={onOpenChangelog}
                            />
                        )}
                        {visibility.delete && (
                            <DeleteMenuItem
                                occurredAtClient={occurredAtClient}
                                isEventWithinValidPeriod={isEventWithinValidPeriod}
                                canEditCompletedEvent={canEditCompletedEvent}
                                disabled={readOnly}
                                onClose={close}
                                onRequestDelete={() => setDeleteConfirmOpen(true)}
                            />
                        )}
                    </FlyoutMenu>
                )}
            />
            {deleteConfirmOpen && (
                <DeleteEventModal
                    eventId={eventId}
                    pendingApiResponse={pendingApiResponse}
                    eventDetailsForRollback={eventDetailsForRollback}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onOptimisticDelete={onOptimisticDelete}
                    onDeleteSuccess={onDeleteSuccess}
                    onDeleteError={onDeleteError}
                />
            )}
        </>
    );
};
