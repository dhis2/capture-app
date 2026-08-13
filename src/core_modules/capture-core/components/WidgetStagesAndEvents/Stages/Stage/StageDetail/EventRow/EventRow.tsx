import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    CircularLoader,
    DataTableCell,
    DataTableRow,
    FlyoutMenu,
    IconMore16,
} from '@dhis2/ui';
import { useEventEditPermissions } from 'capture-core/hooks';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { convertServerToClient } from 'capture-core/converters';
import { dataElementTypes } from 'capture-core/metaData';
import { OverflowButton } from '../../../../../Buttons';
import type { EventRowProps } from './EventRow.types';
import { DeleteActionButton, DeleteActionModal, CompletionMenuItem } from '../../../../../EventOverflowMenu';
import { SkipAction } from './SkipAction';
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

    const { canEditCompletionStatus } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus: eventDetails.status,
        occurredAtClient: convertServerToClient(eventDetails.occurredAt, dataElementTypes.DATE) as string,
        completedAtClient: convertServerToClient(eventDetails.completedAt, dataElementTypes.DATE) as string,
    });

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        const { completedAt, completedBy, ...eventWithoutCompletion } = eventDetails;
        dispatch(updateEnrollmentEvent(id, { ...eventWithoutCompletion, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onCompletionStatusSuccess = useCallback(() => {
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
                        {pendingApiResponse ? (
                            <CircularLoader small dataTest={'event-row-saving-loader'} />
                        ) : (
                            <OverflowButton
                                open={actionsOpen}
                                onClick={() => setActionsOpen(prev => !prev)}
                                dataTest={'overflow-button'}
                                secondary
                                small
                                icon={<IconMore16 />}
                                component={(
                                    <FlyoutMenu
                                        dense
                                        dataTest={'overflow-menu'}
                                    >
                                        {(eventDetails.status === eventStatuses.SCHEDULE ||
                                            eventDetails.status === eventStatuses.SKIPPED) && (
                                            <SkipAction
                                                eventId={id}
                                                eventDetails={eventDetails}
                                                setActionsOpen={setActionsOpen}
                                                pendingApiResponse={pendingApiResponse}
                                                onUpdateEventStatus={onUpdateEventStatus}
                                            />
                                        )}

                                        {canEditCompletionStatus && (
                                            <CompletionMenuItem
                                                eventId={id}
                                                eventStatus={eventDetails.status}
                                                onMutate={onCompletionStatusMutate}
                                                onSuccess={onCompletionStatusSuccess}
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
                        )}

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
