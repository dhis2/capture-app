import React from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from '@tanstack/react-query';
import { errorCreator } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { useTermLabel } from '../../../../../../../metaData';
import { tCustomTerm } from '../../../../../../../utils/tCustomTerm';

type Props = {
    eventId: string;
    pendingApiResponse: boolean;
    eventDetails: ApiEnrollmentEvent;
    onDeleteEvent: (eventId: string) => void;
    onRollbackDeleteEvent: (eventToRollbackOnFail: ApiEnrollmentEvent) => void;
    setDeleteModalOpen: (open: boolean) => void;
};

export const DeleteActionModal = ({
    setDeleteModalOpen,
    pendingApiResponse,
    eventId,
    eventDetails,
    onDeleteEvent,
    onRollbackDeleteEvent,
}: Props) => {
    const eventLabel = useTermLabel('event');
    const { show: showError } = useAlert(
        ({ message }) => message,
        {
            critical: true,
        },
    );
    const dataEngine = useDataEngine();

    const { mutate } = useMutation(
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
                // Capture the event before the optimistic removal so it can be restored
                // from the same source of truth (the rendered redux event) if the delete fails.
                const eventToRollbackOnFail = eventDetails;

                onDeleteEvent(eventId);
                return eventToRollbackOnFail;
            },
            onError: (apiError: unknown, payload: unknown, eventToRollbackOnFail?: ApiEnrollmentEvent) => {
                showError({ message: tCustomTerm('An error occurred while deleting the {{eventLabel}}', { eventLabel }) });
                log.error(errorCreator('An error occurred while deleting the event')({ apiError, payload }));

                if (eventToRollbackOnFail) {
                    onRollbackDeleteEvent(eventToRollbackOnFail);
                }
            },
        },
    );

    return (
        <Modal
            onClose={() => setDeleteModalOpen(false)}
            small
        >
            <ModalTitle>
                {tCustomTerm('Delete {{eventLabel}}', { eventLabel })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {tCustomTerm('Deleting an {{eventLabel}} is permanent and cannot be undone.', { eventLabel })}
                    {' '}
                    {tCustomTerm('Are you sure you want to delete this {{eventLabel}}?', { eventLabel })}
                </p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={() => !pendingApiResponse && mutate({ eventId })}
                    >
                        {tCustomTerm('Yes, delete {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
