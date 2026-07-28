import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    DataTableCell,
    DataTableRow,
    FlyoutMenu,
    IconMore16,
} from '@dhis2/ui';
import { useEventEditPermissions } from 'capture-core/hooks';
import { OverflowButton } from '../../../../../Buttons';
import type { EventRowProps } from './EventRow.types';
import { DeleteActionButton } from '../../../../../EventOverflowMenu/DeleteMenuItem';
import { SkipAction } from './SkipAction';
import { DeleteActionModal } from '../../../../../EventOverflowMenu/DeleteEventModal';
import { EventCompletionMenuItem } from '../../../../../EventOverflowMenu/EventCompletionMenuItem';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
} from '../../../../../Pages/common/EnrollmentOverviewDomain';

const styles: Readonly<any> = {
    row: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
    },
    rowDisabled: {
        cursor: 'not-allowed',
        opacity: 0.5,
    },
};

export const EventStatuses = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
    SCHEDULE: 'SCHEDULE',
};

const EventRowPlain = ({
    id,
    pendingApiResponse,
    eventDetails,
    cells,
    stageWriteAccess,
    programStage,
    onDeleteEvent,
    onRollbackDeleteEvent,
    onUpdateEventStatus,
    programId,
    classes,
}: EventRowProps & WithStyles<typeof styles>) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();

    const { canChangeCompletionStatus } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus: eventDetails.status,
    });

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        const { completedAt, ...eventWithoutCompletion } = eventDetails;
        dispatch(updateEnrollmentEvent(id, { ...eventWithoutCompletion, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onCompletionStatusUpdated = useCallback(() => {
        dispatch(commitEnrollmentEvent(id));
    }, [dispatch, id]);

    const onCompletionStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(id));
    }, [dispatch, id]);

    return (
        <DataTableRow
            className={!pendingApiResponse ? classes.row : classes.rowDisabled}
            key={id}
        >
            {cells}

            <DataTableCell>
                {stageWriteAccess && (
                    <>
                        <OverflowButton
                            open={actionsOpen}
                            onClick={() => setActionsOpen(prev => !prev)}
                            dataTest={'overflow-button'}
                            secondary
                            small
                            icon={<IconMore16 />}
                            disabled={pendingApiResponse}
                            component={(
                                <FlyoutMenu
                                    dense
                                    dataTest={'overflow-menu'}
                                >
                                    {(eventDetails.status === EventStatuses.SCHEDULE ||
                                        eventDetails.status === EventStatuses.SKIPPED) && (
                                        <SkipAction
                                            eventId={id}
                                            eventDetails={eventDetails}
                                            setActionsOpen={setActionsOpen}
                                            pendingApiResponse={pendingApiResponse}
                                            onUpdateEventStatus={onUpdateEventStatus}
                                        />
                                    )}

                                    {canChangeCompletionStatus && (
                                        <EventCompletionMenuItem
                                            eventId={id}
                                            eventStatus={eventDetails.status}
                                            onMutate={onCompletionStatusMutate}
                                            onUpdated={onCompletionStatusUpdated}
                                            onError={onCompletionStatusError}
                                            onClose={() => setActionsOpen(false)}
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
                            )}
                        />

                        {deleteModalOpen && (
                            <DeleteActionModal
                                eventId={id}
                                pendingApiResponse={pendingApiResponse}
                                eventDetails={eventDetails}
                                onDeleteEvent={onDeleteEvent}
                                onRollbackDeleteEvent={onRollbackDeleteEvent}
                                setDeleteModalOpen={setDeleteModalOpen}
                            />
                        )}
                    </>
                )}
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
