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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './UnlinkModal.types';
import { useTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

export const UnlinkModal = ({
    setOpenModal,
    relationshipId,
    originEventId,
    onDeleteEventRelationship,
    stageId,
}: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const eventLabel = useTermLabel('event', { stageId });
    const eventsLabel = useTermLabel('event', { stageId, plural: true });
    const { show: showErrorAlert } = useAlert(
        tCustomTerm('An error occurred while unlinking and deleting the {{eventLabel}}.', { eventLabel }),
        { critical: true },
    );

    const deleteRelationship = async () => {
        const mutation = {
            resource: 'tracker?importStrategy=DELETE&async=false',
            type: 'create',
            data: { relationships: [{ relationship: relationshipId }] },
        };

        return dataEngine.mutate(mutation as any);
    };

    const mutation = useMutation(deleteRelationship, {
        onSuccess: () => {
            queryClient.invalidateQueries([
                ReactQueryAppNamespace,
                'linkedEventByOriginEvent',
                originEventId,
            ]);
            onDeleteEventRelationship && onDeleteEventRelationship(relationshipId);
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
                {tCustomTerm('Unlink {{eventLabel}}', { eventLabel })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {tCustomTerm('Are you sure you want to remove the link between these {{eventsLabel}}?', { eventsLabel })}
                    {' '}
                    {tCustomTerm(
                        'This action removes the link itself, but the linked {{eventLabel}} will remain.',
                        { eventLabel },
                    )}
                </p>
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
                        {tCustomTerm('Yes, unlink {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
