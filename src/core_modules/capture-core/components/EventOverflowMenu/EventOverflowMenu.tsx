import React, { useState } from 'react';
import { FlyoutMenu, IconMore16 } from '@dhis2/ui';
import { FEATURES, useFeature } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { OverflowButton } from '../Buttons';
import { useEventEditPermissions } from '../../hooks';
import { EventCompletionMenuItem } from '../EventCompletionMenuItem';
import { eventStatuses } from '../WidgetEventEdit/constants/status.const';
import type { ProgramStage } from '../../metaData';
import { SkipMenuItem } from './SkipMenuItem';
import { DeleteMenuItem } from './DeleteMenuItem';
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

    onCompletionStatusUpdated?: (newStatus: string) => void;

    onOptimisticStatusUpdate?: (eventId: string, newStatus: string) => void;
    onStatusUpdateError?: (eventId: string, previousStatus: string) => void;
    onStatusUpdateSuccess?: (eventId: string, newStatus: string) => void;

    onOptimisticDelete?: (eventId: string) => void;
    onDeleteSuccess?: (eventId: string) => void;
    onDeleteError?: (event: ApiEnrollmentEvent) => void;

    onOpenChangelog?: () => void;

    dataTest?: string;
};

export const EventOverflowMenu = ({
    eventId,
    eventStatus,
    occurredAt,
    completedAt,
    programId,
    programStage,
    pendingApiResponse,
    eventDetailsForRollback,
    onCompletionStatusUpdated,
    onOptimisticStatusUpdate,
    onStatusUpdateError,
    onStatusUpdateSuccess,
    onOptimisticDelete,
    onDeleteSuccess,
    onDeleteError,
    onOpenChangelog,
    dataTest = 'event-overflow-menu',
}: Props) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const { eventAccess, canChangeCompletionStatus } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus,
    });

    const close = () => setActionsOpen(false);

    const skipHandlerProvided = !!(onOptimisticStatusUpdate || onStatusUpdateSuccess);
    const deleteHandlerProvided = !!(onOptimisticDelete || onDeleteSuccess);

    const showCompletion = canChangeCompletionStatus && !!onCompletionStatusUpdated;
    const showSkip = skipHandlerProvided && !!eventAccess?.write && (
        eventStatus === eventStatuses.SCHEDULE
        || eventStatus === eventStatuses.SKIPPED
    );
    const showDelete = deleteHandlerProvided && !!eventAccess?.write;
    const showChangelog = supportsChangelog && !!onOpenChangelog;

    if (!showCompletion && !showSkip && !showDelete && !showChangelog) {
        return null;
    }

    return (
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
                    {showCompletion && (
                        <EventCompletionMenuItem
                            eventId={eventId}
                            eventStatus={eventStatus}
                            onUpdated={onCompletionStatusUpdated!}
                            onClose={close}
                        />
                    )}
                    {showSkip && (
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
                    {showDelete && (
                        <DeleteMenuItem
                            eventId={eventId}
                            eventStatus={eventStatus}
                            occurredAt={occurredAt}
                            completedAt={completedAt}
                            programId={programId}
                            programStage={programStage}
                            pendingApiResponse={pendingApiResponse}
                            eventDetailsForRollback={eventDetailsForRollback}
                            onClose={close}
                            onOptimisticDelete={onOptimisticDelete}
                            onDeleteSuccess={onDeleteSuccess}
                            onDeleteError={onDeleteError}
                        />
                    )}
                    {showChangelog && (
                        <ChangelogMenuItem
                            onClose={close}
                            onOpenChangelog={onOpenChangelog!}
                        />
                    )}
                </FlyoutMenu>
            )}
        />
    );
};
