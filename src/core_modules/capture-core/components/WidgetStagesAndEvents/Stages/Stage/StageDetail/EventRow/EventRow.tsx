import React, { useState } from 'react';
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
    programId,
    classes,
}: EventRowProps & WithStyles<typeof styles>) => {
    const [changelogOpen, setChangelogOpen] = useState(false);

    return (
        <DataTableRow
            className={!pendingApiResponse ? classes.row : classes.rowDisabled}
            key={id}
        >
            {cells}

            <DataTableCell>
                {stageWriteAccess && (
                    <>
                        <EventOverflowMenu
                            eventId={id}
                            eventDetails={eventDetails}
                            programId={programId}
                            programStage={programStage}
                            pendingApiResponse={pendingApiResponse}
                            onDeleteEvent={onDeleteEvent}
                            onRollbackDeleteEvent={onRollbackDeleteEvent}
                            onOpenChangelog={() => setChangelogOpen(true)}
                            dataTest={'overflow'}
                        />

                        {changelogOpen && programStage?.stageForm && (
                            <EventChangelogWrapper
                                isOpen
                                setIsOpen={setChangelogOpen}
                                eventId={id}
                                formFoundation={programStage.stageForm}
                            />
                        )}
                    </>
                )}
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
