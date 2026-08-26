import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    CircularLoader,
    DataTableCell,
    DataTableRow,
    IconMore16,
} from '@dhis2/ui';
import { useEventEditPermissions } from 'capture-core/hooks';
import { convertServerToClient } from 'capture-core/converters';
import { dataElementTypes } from 'capture-core/metaData';
import { OverflowButton } from '../../../../../Buttons';
import type { EventRowProps } from './EventRow.types';
import { EventOverflowMenu, DeleteMenuItemModal } from '../../../../../EventOverflowMenu';
import { EventChangelogWrapper } from '../../../../../WidgetEventEdit/EventChangelogWrapper';
import { getReadOnlyMessage } from '../../../../../ReadOnlyBadge';
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

const getRowClass = (classes: Record<string, string>, disabled: boolean) =>
    (disabled ? classes.rowDisabled : classes.row);

const EventRowPlain = ({
    id,
    pendingApiResponse,
    eventDetails,
    cells,
    programStage,
    onDeleteEvent,
    onRollbackDeleteEvent,
    programId,
    classes,
}: EventRowProps & WithStyles<typeof styles>) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [changelogOpen, setChangelogOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        canMutateEvent, canToggleCompletion, isEventBlockedByExpiry, isEventBlockedByCompletion,
        isEventBlockedByUncompleteAuthority, canEditProgramStage,
    } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus: eventDetails.status,
        occurredAtClient: convertServerToClient(eventDetails.occurredAt, dataElementTypes.DATE) as string,
        completedAtClient: convertServerToClient(eventDetails.completedAt, dataElementTypes.DATE) as string,
        scheduledAtClient: convertServerToClient(eventDetails.scheduledAt, dataElementTypes.DATE) as string,
    });
    const readOnlyMessage = getReadOnlyMessage({
        access: { program: true, trackedEntityType: true, programStage: canEditProgramStage },
        trackedEntityName: undefined,
        multipleStages: false,
        isEventBlockedByExpiry,
        isEventBlockedByCompletion,
        isEventBlockedByUncompleteAuthority,
        trackedEntityInactive: false,
    });

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
                <>
                    {pendingApiResponse && <CircularLoader small dataTest={'event-row-saving-loader'} />}

                    {!pendingApiResponse && (
                        <OverflowButton
                            open={actionsOpen}
                            onClick={() => setActionsOpen(prev => !prev)}
                            dataTest={'overflow-button'}
                            secondary
                            small
                            icon={<IconMore16 />}
                            component={(
                                <EventOverflowMenu
                                    eventId={id}
                                    eventStatus={eventDetails.status}
                                    onOpenChangelog={() => setChangelogOpen(true)}
                                    onClose={() => setActionsOpen(false)}
                                    hideMutationActions={!canEditProgramStage}
                                    onSkipMutate={onSkipStatusMutate}
                                    onSkipSuccess={onSkipStatusSuccess}
                                    onSkipError={onSkipStatusError}
                                    onCompletionMutate={onCompletionStatusMutate}
                                    onCompletionSuccess={onCompletionStatusSuccess}
                                    onCompletionError={onCompletionStatusError}
                                    onDeleteRequest={() => setDeleteModalOpen(true)}
                                    canMutateEvent={canMutateEvent}
                                    canToggleCompletion={canToggleCompletion}
                                    readOnlyMessage={readOnlyMessage}
                                />
                            )}
                        />
                    )}
                    {deleteModalOpen && (
                        <DeleteMenuItemModal
                            eventId={id}
                            pendingApiResponse={pendingApiResponse}
                            eventDetails={eventDetails}
                            onDeleteEvent={onDeleteEvent}
                            onRollbackDeleteEvent={onRollbackDeleteEvent}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />
                    )}
                    {changelogOpen && programStage?.stageForm && (
                        <EventChangelogWrapper
                            isOpen
                            setIsOpen={setChangelogOpen}
                            eventId={id}
                            formFoundation={programStage.stageForm}
                        />
                    )}
                </>
            </DataTableCell>
        </DataTableRow>
    );
};

export const EventRow = withStyles(styles)(EventRowPlain);
