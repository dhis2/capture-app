import React from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    colors,
    IconDelete16,
    MenuItem,
    Modal,
    ModalActions, ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from '@tanstack/react-query';
import { errorCreator } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

type DeleteMenuItemProps = {
    onDeleteRequest: () => void;
    onClose: () => void;
    isEventBlockedByExpiry: boolean;
    readOnlyMessage: string;
};

export const DeleteMenuItem = ({
    onDeleteRequest,
    onClose,
    isEventBlockedByExpiry,
    readOnlyMessage,
}: DeleteMenuItemProps) => (
    <ConditionalTooltip content={readOnlyMessage} enabled={isEventBlockedByExpiry}>
        <MenuItem
            dense
            disabled={isEventBlockedByExpiry}
            icon={<IconDelete16 color={isEventBlockedByExpiry ? undefined : colors.red600} />}
            label={i18n.t('Delete')}
            dataTest="stages-and-events-delete"
            onClick={() => {
                onDeleteRequest();
                onClose();
            }}
            suffix={null}
        />
    </ConditionalTooltip>
);

type DeleteMenuItemModalProps = {
    eventId: string;
    eventDetails: ApiEnrollmentEvent;
    onDeleteEvent: (eventId: string) => void;
    onRollbackDeleteEvent: (eventToRollbackOnFail: ApiEnrollmentEvent) => void;
    setDeleteModalOpen: (open: boolean) => void;
};

export const DeleteMenuItemModal = ({
    setDeleteModalOpen,
    eventId,
    eventDetails,
    onDeleteEvent,
    onRollbackDeleteEvent,
}: DeleteMenuItemModalProps) => {
    const { show: showError } = useAlert(
        ({ message }) => message,
        { critical: true },
    );
    const dataEngine = useDataEngine();

    const { mutate, isLoading } = useMutation(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: { events: [{ event: eventId }] },
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
        <Modal onClose={() => setDeleteModalOpen(false)} small>
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
                    <Button onClick={() => setDeleteModalOpen(false)}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button destructive disabled={isLoading} onClick={() => mutate(undefined)}>
                        {i18n.t('Yes, delete event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
