// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import log from 'loglevel';
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './UnlinkAndDeleteModal.types';

export const UnlinkAndDeleteModal = ({
    setOpenModal,
    eventId,
    originEventId,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while unlinking and deleting the event.'),
        { critical: true },
    );

    const deleteEvent = async () => {
        const mutation = {
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: { events: [{ event: eventId }] },
        };

        return dataEngine.mutate(mutation);
    };

    const mutation = useMutation(deleteEvent, {
        onSuccess: () => {
            queryClient.invalidateQueries([
                ReactQueryAppNamespace,
                'linkedEventByOriginEvent',
                originEventId,
            ]);
            setOpenModal(false);
        },
        onError: (error) => {
            showErrorAlert();
            log.error(
                `Failed to unlink and delete event with ID: ${eventId}`,
                error,
            );
        },
    });

    return (
        <Modal dataTest="event-unlink-and-delete-modal" position="middle">
            <ModalTitle>{i18n.t('Delete event')}</ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want delete the relationsship and the related event? This will permanently remove the event and all related data.',
                    )}
                </p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button
                        onClick={() => setOpenModal(false)}
                        secondary
                    >
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isLoading}
                    >
                        {i18n.t('Yes, unlink and delete event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
