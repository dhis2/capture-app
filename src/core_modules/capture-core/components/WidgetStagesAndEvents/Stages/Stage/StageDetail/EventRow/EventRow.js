// @flow
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/';
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

const styles = {
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
    onDeleteEvent,
    onRollbackDeleteEvent,
    onUpdateEventStatus,
    teiId,
    programId,
    enrollmentId,
    classes,
}: EventRowProps) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    return (
        <DataTableRow
            className={!pendingApiResponse ? classes.row : classes.rowDisabled}
            key={id}
        >
            {cells}

            <DataTableCell>
                <>
                    <OverflowButton
                        open={actionsOpen}
                        onClick={() => setActionsOpen(prev => !prev)}
                        dataTest={'overflow-button'}
                        secondary
                        small
                        icon={<IconMore16 />}
                        disabled={pendingApiResponse || !stageWriteAccess}
                        component={(
                            <FlyoutMenu
                                dense
                                dataTest={'overflow-menu'}
                            >
                                {(eventDetails.status === EventStatuses.SCHEDULE || eventDetails.status === EventStatuses.SKIPPED) && (
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
                            enrollmentId={enrollmentId}
                            onDeleteEvent={onDeleteEvent}
                            onRollbackDeleteEvent={onRollbackDeleteEvent}
                            setActionsOpen={setActionsOpen}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />
                    )}
                </>
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
