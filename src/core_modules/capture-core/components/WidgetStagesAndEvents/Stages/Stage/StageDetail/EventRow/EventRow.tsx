import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    DataTableCell,
    DataTableRow,
    FlyoutMenu,
    IconMore16,
} from '@dhis2/ui';
import { OverflowButton } from '../../../../../Buttons';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import type { EventRowProps } from './EventRow.types';
import { DeleteActionButton } from './DeleteActionButton';
import { SkipAction } from './SkipAction';
import { DeleteActionModal } from './DeleteActionModal';
import { useProgramExpiryForUser } from '../../../../../../hooks';

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
    onDeleteEvent,
    onRollbackDeleteEvent,
    onUpdateEventStatus,
    teiId,
    programId,
    enrollmentId,
    readOnly,
    classes,
}: EventRowProps & WithStyles<typeof styles>) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const expiryPeriod = useProgramExpiryForUser(programId);

    return (
        <DataTableRow
            className={!pendingApiResponse ? classes.row : classes.rowDisabled}
            key={id}
        >
            {cells}

            <DataTableCell>
                <>
                    <ConditionalTooltip
                        content={
                            readOnly
                                ? readOnly.tooltipContent
                                : i18n.t('You do not have access to perform actions on this event')
                        }
                        enabled={Boolean(readOnly) || !stageWriteAccess}
                    >
                        <OverflowButton
                            open={actionsOpen}
                            onClick={() => setActionsOpen(prev => !prev)}
                            dataTest={'overflow-button'}
                            secondary
                            small
                            icon={<IconMore16 />}
                            disabled={pendingApiResponse || !stageWriteAccess || Boolean(readOnly)}
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
                                        expiryPeriod={expiryPeriod}
                                    />
                                </FlyoutMenu>
                            )}
                        />
                    </ConditionalTooltip>

                    {deleteModalOpen && (
                        <DeleteActionModal
                            eventId={id}
                            pendingApiResponse={pendingApiResponse}
                            teiId={teiId}
                            programId={programId}
                            enrollmentId={enrollmentId}
                            onDeleteEvent={onDeleteEvent}
                            onRollbackDeleteEvent={onRollbackDeleteEvent}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />
                    )}
                </>
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
