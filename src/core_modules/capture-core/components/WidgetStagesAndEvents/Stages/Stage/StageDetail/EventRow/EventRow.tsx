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
import { DeleteMenuItem, CompletionMenuItem, SkipMenuItem } from '../../../../../EventOverflowMenu';
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

const isSkippableStatus = (status?: string) =>
    status === eventStatuses.SCHEDULE || status === eventStatuses.SKIPPED;

const getRowClass = (classes: Record<string, string>, disabled: boolean) =>
    (disabled ? classes.rowDisabled : classes.row);

const isCompletionToggleable = (status: string, blockedByCompletion: boolean, blockedByExpiry: boolean) =>
    !blockedByCompletion
    && !blockedByExpiry
    && (status === eventStatuses.ACTIVE || status === eventStatuses.COMPLETED);

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
    const [actionsOpen, setActionsOpen] = useState(false);
    const dispatch = useDispatch();

    const { isEventReadOnly, isEventBlockedByCompletion, isEventBlockedByExpiry } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus: eventDetails.status,
        occurredAtClient: convertServerToClient(eventDetails.occurredAt, dataElementTypes.DATE) as string,
        completedAtClient: convertServerToClient(eventDetails.completedAt, dataElementTypes.DATE) as string,
    });
    const canToggleCompletion = isCompletionToggleable(
        eventDetails.status,
        isEventBlockedByCompletion,
        isEventBlockedByExpiry,
    );
    const showOverflowButton = !isEventReadOnly || canToggleCompletion || isSkippableStatus(eventDetails.status);

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        const { completedAt, ...eventWithoutCompletion } = eventDetails;
        dispatch(updateEnrollmentEvent(id, { ...eventWithoutCompletion, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onCompletionStatusSuccess = useCallback(() => {
        dispatch(commitEnrollmentEvent(id));
    }, [dispatch, id]);

    const onCompletionStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(id));
    }, [dispatch, id]);

    const onSkipStatusMutate = useCallback((newStatus: string) => {
        dispatch(updateEnrollmentEvent(id, { ...eventDetails, status: newStatus }));
    }, [dispatch, eventDetails, id]);

    const onSkipStatusSuccess = useCallback(() => {
        dispatch(commitEnrollmentEvent(id));
    }, [dispatch, id]);

    const onSkipStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(id));
    }, [dispatch, id]);

    return (
        <DataTableRow
            className={getRowClass(classes, !!pendingApiResponse)}
            key={id}
        >
            {cells}

            <DataTableCell>
                {stageWriteAccess && (
                    <>
                        {pendingApiResponse && <CircularLoader small dataTest={'event-row-saving-loader'} />}

                        {!pendingApiResponse && showOverflowButton && (
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
                                        {isSkippableStatus(eventDetails.status) && (
                                            <SkipMenuItem
                                                eventId={id}
                                                eventStatus={eventDetails.status}
                                                onMutate={onSkipStatusMutate}
                                                onSuccess={onSkipStatusSuccess}
                                                onError={onSkipStatusError}
                                                onClose={() => setActionsOpen(false)}
                                            />
                                        )}

                                        {canToggleCompletion && (
                                            <CompletionMenuItem
                                                eventId={id}
                                                eventStatus={eventDetails.status}
                                                onMutate={onCompletionStatusMutate}
                                                onSuccess={onCompletionStatusSuccess}
                                                onError={onCompletionStatusError}
                                                onClose={() => setActionsOpen(false)}
                                            />
                                        )}

                                        <DeleteMenuItem
                                            eventId={id}
                                            pendingApiResponse={pendingApiResponse}
                                            eventDetails={eventDetails}
                                            onDeleteEvent={onDeleteEvent}
                                            onRollbackDeleteEvent={onRollbackDeleteEvent}
                                            onClose={() => setActionsOpen(false)}
                                        />
                                    </FlyoutMenu>
                                )}
                            />
                        )}
                    </>
                )}
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
