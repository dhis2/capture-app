// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Modal,
    ModalContent,
    ModalTitle,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import log from 'loglevel';
import { useDataEngine, useAlert } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from 'react-query';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './UnlinkModal.types';

export const UnlinkModal = ({
    setOpenModal,
    relationshipId,
    originEventId,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showErrorAlert } = useAlert(
        i18n.t('An error occurred while unlinking and deleting the event.'),
        { critical: true },
    );

    const deleteRelationship = async () => {
        const mutation = {
            resource: 'tracker?importStrategy=DELETE&async=false',
            type: 'create',
            data: { relationships: [{ relationship: relationshipId }] },
        };

        return dataEngine.mutate(mutation);
    };

    const mutation = useMutation(deleteRelationship, {
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
                `Failed to remove relationship with id ${relationshipId}`,
                error,
            );
        },
    });

    return (
        <Modal dataTest="event-unlink-modal">
            <ModalTitle>
                {i18n.t('Unlink event')}
            </ModalTitle>
            <ModalContent>
                <p>{i18n.t('Are you sure you want to remove the link between these events? This action removes the link itself, but the linked event will remain.')}</p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenModal(false)} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isLoading}
                        dataTest="event-overflow-unlink-event-confirm"
                    >
                        {i18n.t('Yes, unlink event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
