import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { EventOverflowMenu } from '../../../../../EventOverflowMenu';
import { EventChangelogWrapper } from '../../../../../WidgetEventEdit/EventChangelogWrapper';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
} from '../../../../../Pages/common/EnrollmentOverviewDomain';
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
    const dispatch = useDispatch();

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        const { completedAt, completedBy, ...eventWithoutCompletion } = eventDetails;
        dispatch(updateEnrollmentEvent(id, { ...eventWithoutCompletion, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onCompletionStatusUpdated = useCallback(() => {
        dispatch(commitEnrollmentEvent(id));
    }, [dispatch, id]);

    const onCompletionStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(id));
    }, [dispatch, id]);

    const onStatusMutate = useCallback((_id: string, newStatus: string) => {
        dispatch(updateEnrollmentEvent(id, { ...eventDetails, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onStatusUpdated = useCallback(() => {
        dispatch(commitEnrollmentEvent(id));
    }, [dispatch, id]);

    const onStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(id));
    }, [dispatch, id]);

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
                            onCompletionStatusMutate={onCompletionStatusMutate}
                            onCompletionStatusUpdated={onCompletionStatusUpdated}
                            onCompletionStatusError={onCompletionStatusError}
                            onStatusMutate={onStatusMutate}
                            onStatusUpdated={onStatusUpdated}
                            onStatusError={onStatusError}
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
