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
    NoticeBox,
} from '@dhis2/ui';
import { useDataEngine } from '@dhis2/app-runtime';
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
    });

    return (
        <Modal dataTest="event-unlink-modal">
            <ModalTitle>
                {i18n.t('Unlink relationship')}
            </ModalTitle>
            <ModalContent>
                <p>{i18n.t('Are you sure you want to unlink this relationship?')}</p>
                {mutation.isError && (
                    <NoticeBox
                        title={i18n.t('There was a problem unlinking the relationship')}
                        error
                    >
                        {mutation.error?.message}
                    </NoticeBox>
                )}
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
                    >
                        {i18n.t('Yes, unlink relationship')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
