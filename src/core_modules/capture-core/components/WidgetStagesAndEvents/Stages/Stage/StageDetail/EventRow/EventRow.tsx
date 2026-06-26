import React, { useState } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    DataTableCell,
    DataTableRow,
    FlyoutMenu,
    IconMore16,
} from '@dhis2/ui';
import { OverflowButton } from '../../../../../Buttons';
import type { EventRowProps } from './EventRow.types';
import { DeleteActionButton } from './DeleteActionButton';
import { SkipAction } from './SkipAction';
import { DeleteActionModal } from './DeleteActionModal';

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
    teiId,
    programId,
    enrollmentId,
    classes,
}: EventRowProps & WithStyles<typeof styles>) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
                                teiId={teiId}
                                programId={programId}
                                stageId={programStage?.id}
                                enrollmentId={enrollmentId}
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
