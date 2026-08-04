import React, { useState } from 'react';
import { CircularLoader, FlyoutMenu, IconMore16 } from '@dhis2/ui';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { OverflowButton } from '../Buttons';
import { useEventPermissions } from '../../hooks';
import { convertServerToClient } from '../../converters';
import { dataElementTypes, type ProgramStage } from '../../metaData';
import {
    SkipMenuItem,
    DeleteMenuItem,
    DeleteEventModal,
    ChangelogMenuItem,
    CompletionMenuItem,
} from './MenuItems';

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

    onStatusMutate?: (eventId: string, newStatus: string) => void;
    onStatusError?: (eventId: string, previousStatus: string) => void;
    onStatusUpdated?: (eventId: string, newStatus: string) => void;

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

const hasHandler = (...handlers: Array<unknown>) => handlers.some(Boolean);

// An item shows when the user is allowed to perform the action (`useEventPermissions`) AND the
// host wired up the handlers it needs - hosts opt into actions by passing the callbacks.
const computeVisibility = (props: Props, permissions: {
    canCompleteEvent: boolean;
    canSkipEvent: boolean;
    canDeleteEvent: boolean;
}): Visibility => {
    const completion = permissions.canCompleteEvent && hasHandler(props.onCompletionStatusUpdated);
    const skip = permissions.canSkipEvent && hasHandler(props.onStatusMutate, props.onStatusUpdated);
    const del = permissions.canDeleteEvent && hasHandler(props.onOptimisticDelete, props.onDeleteSuccess);
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
        onStatusMutate,
        onStatusError,
        onStatusUpdated,
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
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        readOnly,
        canCompleteEvent,
        canSkipEvent,
        canDeleteEvent,
    } = useEventPermissions({
        programId,
        stage: programStage,
        eventStatus,
        occurredAtClient,
        completedAtClient,
    });

    const visibility = computeVisibility(props, { canCompleteEvent, canSkipEvent, canDeleteEvent });

    if (!visibility.any) {
        return null;
    }

    const close = () => setActionsOpen(false);

    return (
        <>
            {pendingApiResponse ? (
                <CircularLoader small dataTest={`${dataTest}-saving-loader`} />
            ) : (
                <OverflowButton
                    open={actionsOpen}
                    onClick={() => setActionsOpen(prev => !prev)}
                    secondary
                    small
                    icon={<IconMore16 />}
                    dataTest={`${dataTest}-button`}
                    component={(
                        <FlyoutMenu dense maxWidth="250px" dataTest={dataTest}>
                            {visibility.completion && onCompletionStatusUpdated && (
                                <CompletionMenuItem
                                    eventId={eventId}
                                    eventStatus={eventStatus}
                                    onMutate={onCompletionStatusMutate}
                                    onSuccess={onCompletionStatusUpdated}
                                    onError={onCompletionStatusError}
                                    onClose={close}
                                />
                            )}
                            {visibility.skip && (
                                <SkipMenuItem
                                    eventId={eventId}
                                    eventStatus={eventStatus}
                                    onClose={close}
                                    onStatusMutate={onStatusMutate}
                                    onStatusError={onStatusError}
                                    onStatusUpdated={onStatusUpdated}
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
            )}
            {deleteConfirmOpen && (
                <DeleteEventModal
                    eventId={eventId}
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
