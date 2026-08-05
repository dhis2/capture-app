import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { CircularLoader, FlyoutMenu, IconMore16, MenuItem } from '@dhis2/ui';
import { FEATURES, useFeature } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { useCanChangeCompletionStatus } from 'capture-core/hooks';
import { OverflowButton } from '../Buttons';
import { type ProgramStage } from '../../metaData';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
} from '../Pages/common/EnrollmentOverviewDomain';
import {
    CompletionMenuItem,
    SkipMenuItem,
    DeleteActionButton,
    DeleteActionModal,
} from './MenuItems';

type Props = {
    eventId: string;
    eventDetails: ApiEnrollmentEvent;
    programId: string;
    programStage?: ProgramStage | null;
    pendingApiResponse?: boolean;
    onDeleteEvent: (eventId: string) => void;
    onRollbackDeleteEvent: (event: ApiEnrollmentEvent) => void;
    onOpenChangelog: () => void;
    onStatusUpdated?: (newStatus: string) => void;
    dataTest: string;
};

export const EventOverflowMenu = ({
    eventId,
    eventDetails,
    programId,
    programStage,
    pendingApiResponse,
    onDeleteEvent,
    onRollbackDeleteEvent,
    onOpenChangelog,
    onStatusUpdated,
    dataTest,
}: Props) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    const supportsChangelog = useFeature(FEATURES.changelogs);

    const canChangeCompletionStatus = useCanChangeCompletionStatus({
        programId,
        stage: programStage,
        eventStatus: eventDetails.status,
    });
    const canSkip = eventDetails.status === eventStatuses.SCHEDULE ||
        eventDetails.status === eventStatuses.SKIPPED;

    // Optimistic update shared by both status toggles (complete/incomplete and skip/unskip):
    // apply the new status right away, then commit on success or roll back on error.
    const onStatusMutate = (newStatus: string) => {
        const { completedAt, completedBy, ...eventWithoutCompletion } = eventDetails;
        dispatch(updateEnrollmentEvent(eventId, { ...eventWithoutCompletion, status: newStatus }));
    };
    const onStatusSuccess = (newStatus: string) => {
        dispatch(commitEnrollmentEvent(eventId));
        onStatusUpdated?.(newStatus);
    };
    const onStatusError = () => {
        dispatch(rollbackEnrollmentEvent(eventId));
    };

    if (pendingApiResponse) {
        return <CircularLoader small dataTest={'event-row-saving-loader'} />;
    }

    return (
        <>
            <OverflowButton
                open={actionsOpen}
                onClick={() => setActionsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest={`${dataTest}-button`}
                component={
                    <FlyoutMenu
                        dense
                        maxWidth="250px"
                        dataTest={`${dataTest}-menu`}
                    >
                        {canChangeCompletionStatus && (
                            <CompletionMenuItem
                                eventId={eventId}
                                eventStatus={eventDetails.status}
                                onMutate={onStatusMutate}
                                onSuccess={onStatusSuccess}
                                onError={onStatusError}
                                onClose={() => setActionsOpen(false)}
                            />
                        )}
                        {canSkip && (
                            <SkipMenuItem
                                eventId={eventId}
                                eventDetails={eventDetails}
                                onMutate={onStatusMutate}
                                onSuccess={onStatusSuccess}
                                onError={onStatusError}
                                onClose={() => setActionsOpen(false)}
                            />
                        )}
                        {supportsChangelog && (
                            <MenuItem
                                dense
                                label={i18n.t('View changelog')}
                                suffix=""
                                onClick={() => {
                                    onOpenChangelog();
                                    setActionsOpen(false);
                                }}
                            />
                        )}
                        <DeleteActionButton
                            setActionsOpen={setActionsOpen}
                            setDeleteModalOpen={setDeleteModalOpen}
                            occurredAt={eventDetails.occurredAt}
                            completedAt={eventDetails.completedAt}
                            eventStatus={eventDetails.status}
                            programId={programId}
                            programStage={programStage}
                        />
                    </FlyoutMenu>
                }
            />

            {deleteModalOpen && (
                <DeleteActionModal
                    eventId={eventId}
                    pendingApiResponse={!!pendingApiResponse}
                    eventDetails={eventDetails}
                    onDeleteEvent={onDeleteEvent}
                    onRollbackDeleteEvent={onRollbackDeleteEvent}
                    setDeleteModalOpen={setDeleteModalOpen}
                />
            )}
        </>
    );
};
