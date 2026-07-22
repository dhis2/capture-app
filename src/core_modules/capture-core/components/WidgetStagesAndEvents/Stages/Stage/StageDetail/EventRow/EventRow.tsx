import React, { useMemo, useState } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { EventOverflowMenu } from '../../../../../EventOverflowMenu';
import { EventChangelogWrapper } from '../../../../../WidgetEventEdit/EventChangelogWrapper';
import type { EventRowProps } from './EventRow.types';

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
    const [changelogOpen, setChangelogOpen] = useState(false);

    const changelogEventData = useMemo(
        () => (eventDetails.dataValues ?? []).reduce<Record<string, { value: string }>>(
            (acc, { dataElement, value }) => {
                acc[dataElement] = { value };
                return acc;
            },
            {},
        ),
        [eventDetails.dataValues],
    );

    return (
        <>
            <DataTableRow
                className={!pendingApiResponse ? classes.row : classes.rowDisabled}
                key={id}
            >
                {cells}

                <DataTableCell>
                    {stageWriteAccess && (
                        <EventOverflowMenu
                            eventId={id}
                            eventStatus={eventDetails.status}
                            occurredAt={eventDetails.occurredAt}
                            completedAt={eventDetails.completedAt}
                            programId={programId}
                            programStage={programStage}
                            pendingApiResponse={pendingApiResponse}
                            eventDetailsForRollback={eventDetails}
                            onCompletionStatusUpdated={newStatus => onUpdateEventStatus(id, newStatus)}
                            onOptimisticStatusUpdate={onUpdateEventStatus}
                            onStatusUpdateError={onUpdateEventStatus}
                            onOptimisticDelete={onDeleteEvent}
                            onDeleteError={onRollbackDeleteEvent}
                            onOpenChangelog={() => setChangelogOpen(true)}
                            dataTest="overflow-menu"
                        />
                    )}
                </DataTableCell>
            </DataTableRow>
            {changelogOpen && programStage?.stageForm && (
                <EventChangelogWrapper
                    isOpen
                    setIsOpen={setChangelogOpen}
                    eventData={changelogEventData}
                    eventId={id}
                    formFoundation={programStage.stageForm}
                />
            )}
        </>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
