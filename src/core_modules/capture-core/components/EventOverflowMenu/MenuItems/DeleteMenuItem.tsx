import React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import {
    IconDelete16,
    MenuItem,
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';
import { convertClientToView } from '../../../converters';
import { dataElementTypes } from '../../../metaData';

type TriggerProps = {
    occurredAtClient?: string;
    isEventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
    disabled: boolean;
    onClose: () => void;
    onRequestDelete: () => void;
};

export const DeleteMenuItem = ({
    occurredAtClient,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
    disabled,
    onClose,
    onRequestDelete,
}: TriggerProps) => {
    const getDisabledMessage = (): string => {
        if (!isEventWithinValidPeriod) {
            return i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be deleted', {
                occurredAt: convertClientToView(occurredAtClient ?? '', dataElementTypes.DATE),
                interpolation: { escapeValue: false },
            });
        }
        if (!canEditCompletedEvent) {
            return i18n.t('This event has been completed');
        }
        return i18n.t('This event is outside the edit period');
    };

    return (
        <ConditionalTooltip content={getDisabledMessage()} enabled={disabled}>
            <MenuItem
                destructive
                dense
                disabled={disabled}
                icon={<IconDelete16 />}
                label={i18n.t('Delete event')}
                dataTest="event-overflow-delete"
                onClick={() => {
                    onRequestDelete();
                    onClose();
                }}
                suffix={null}
            />
        </ConditionalTooltip>
    );
};

type ModalProps = {
    eventId: string;
    pendingApiResponse?: boolean;
    eventDetailsForRollback?: ApiEnrollmentEvent;
    onClose: () => void;
    onOptimisticDelete?: (eventId: string) => void;
    onDeleteSuccess?: (eventId: string) => void;
    onDeleteError?: (event: ApiEnrollmentEvent) => void;
};

export const DeleteEventModal = ({
    eventId,
    pendingApiResponse,
    eventDetailsForRollback,
    onClose,
    onOptimisticDelete,
    onDeleteSuccess,
    onDeleteError,
}: ModalProps) => {
    const dataEngine = useDataEngine();
    const { show: showError } = useAlert(({ message }) => message, { critical: true });

    const { mutate: deleteEvent } = useMutation(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                events: [{ event: eventId }],
            },
        }),
        {
            onMutate: () => {
                onOptimisticDelete?.(eventId);
                return eventDetailsForRollback;
            },
            onError: (apiError: unknown, _payload: unknown, eventToRollbackOnFail?: ApiEnrollmentEvent) => {
                showError({ message: i18n.t('An error occurred while deleting the event') });
                log.error(errorCreator('An error occurred while deleting the event')({ apiError }));
                if (eventToRollbackOnFail) {
                    onDeleteError?.(eventToRollbackOnFail);
                }
            },
            onSuccess: () => {
                onDeleteSuccess?.(eventId);
            },
        },
    );

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>{i18n.t('Delete event')}</ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t('Deleting an event is permanent and cannot be undone.')}
                    {' '}
                    {i18n.t('Are you sure you want to delete this event?')}
                </p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={() => {
                            if (!pendingApiResponse) {
                                onClose();
                                deleteEvent(undefined);
                            }
                        }}
                    >
                        {i18n.t('Yes, delete event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
