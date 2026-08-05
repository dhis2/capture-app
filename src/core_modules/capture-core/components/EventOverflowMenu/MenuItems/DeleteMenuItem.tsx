import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import {
    colors,
    Button,
    ButtonStrip,
    IconDelete16,
    MenuItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from '@tanstack/react-query';
import { errorCreator } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';
import { convertClientToView, convertServerToClient } from '../../../converters';
import { dataElementTypes, type ProgramStage } from '../../../metaData';
import { useEventEditPermissions } from '../../../hooks';

type MenuItemProps = {
    occurredAt: string;
    completedAt?: string;
    eventStatus?: string;
    programId: string;
    programStage?: ProgramStage | null;
    onRequestDelete: () => void;
    onClose: () => void;
};

export const DeleteMenuItem = ({
    occurredAt,
    completedAt,
    eventStatus,
    programId,
    programStage,
    onRequestDelete,
    onClose,
}: MenuItemProps) => {
    const occurredAtClient = convertServerToClient(occurredAt, dataElementTypes.DATE) as string;
    const occurredAtClientView = convertClientToView(occurredAtClient, dataElementTypes.DATE);

    const {
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        readOnly,
    } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus,
        occurredAtClient,
        completedAtClient: convertServerToClient(completedAt, dataElementTypes.DATE) as string,
    });

    const getDisabledMessage = (): string => {
        if (!isEventWithinValidPeriod) {
            return i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be deleted', {
                occurredAt: occurredAtClientView,
                interpolation: { escapeValue: false },
            });
        }
        if (!canEditCompletedEvent) {
            return i18n.t('This event has been completed');
        }
        return i18n.t('This event is outside the edit period');
    };

    return (
        <ConditionalTooltip
            content={getDisabledMessage()}
            enabled={readOnly}
        >
            <MenuItem
                dense
                disabled={readOnly}
                icon={<IconDelete16 color={colors.red600} />}
                label={i18n.t('Delete')}
                dataTest="stages-and-events-delete"
                onClick={() => {
                    onRequestDelete();
                    onClose();
                }}
                suffix=""
            />
        </ConditionalTooltip>
    );
};

type ModalProps = {
    eventId: string;
    eventDetails: ApiEnrollmentEvent;
    onDeleteEvent: (eventId: string) => void;
    onRollbackDeleteEvent: (eventToRollbackOnFail: ApiEnrollmentEvent) => void;
    onClose: () => void;
};

export const DeleteEventModal = ({
    eventId,
    eventDetails,
    onDeleteEvent,
    onRollbackDeleteEvent,
    onClose,
}: ModalProps) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(
        ({ message }) => message,
        {
            critical: true,
        },
    );

    const { mutate: deleteEvent } = useMutation(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                events: [
                    {
                        event: eventId,
                    },
                ],
            },
        }),
        {
            onMutate: () => {
                const eventToRollbackOnFail = eventDetails;

                onDeleteEvent(eventId);
                return eventToRollbackOnFail;
            },
            onError: (apiError: unknown, payload: unknown, eventToRollbackOnFail?: ApiEnrollmentEvent) => {
                showError({ message: i18n.t('An error occurred while deleting the event') });
                log.error(errorCreator('An error occurred while deleting the event')({ apiError, payload }));

                if (eventToRollbackOnFail) {
                    onRollbackDeleteEvent(eventToRollbackOnFail);
                }
            },
        },
    );

    return (
        <Modal
            onClose={onClose}
            small
        >
            <ModalTitle>
                {i18n.t('Delete event')}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t('Deleting an event is permanent and cannot be undone.')}
                    {' '}
                    {i18n.t('Are you sure you want to delete this event?')}
                </p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={onClose}
                    >
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={() => {
                            onClose();
                            deleteEvent(undefined);
                        }}
                    >
                        {i18n.t('Yes, delete event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
