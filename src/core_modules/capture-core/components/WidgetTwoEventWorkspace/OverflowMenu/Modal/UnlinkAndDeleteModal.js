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
    NoticeBox,
} from '@dhis2/ui';
import { useDataEngine } from '@dhis2/app-runtime';
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
    });

    return (
        <Modal dataTest="event-unlink-and-delete-modal" position="middle">
            <ModalTitle>{i18n.t('Delete event')}</ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want to unlink and delete the event? This will permanently remove the event and all related data.',
                    )}
                </p>
                {mutation.isError && (
                    <NoticeBox
                        title={i18n.t('There was a problem unlinking and deleting the event')}
                        error
                    >
                        {mutation.error?.message}
                    </NoticeBox>
                )}
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
