// @flow
import React, { useState } from 'react';
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
import { useDeleteRelationship } from './useDeleteRelationship';
import type { Props } from './UnlinkModal.types';

export const UnlinkModal = ({
    setOpenModal,
    relationshipId,
    setUpdateData,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const { onDeleteRelationship } = useDeleteRelationship({ sourceId: relationshipId });

    const handleUnlink = async () => {
        setLoading(true);
        setErrorMessage(null);
        setUpdateData(true);

        try {
            await onDeleteRelationship({ relationshipId });
            setOpenModal(false);
        } catch (error) {
            setErrorMessage(i18n.t('An error occurred while unlinking the relationship.'));
            setLoading(false);
        } finally {
            setLoading(false);
            setUpdateData(false);
        }
    };

    return (
        <Modal dataTest="event-unlink-modal">
            <ModalTitle>
                {i18n.t('Unlink relationship')}
            </ModalTitle>
            <ModalContent>
                <p>{i18n.t('Are you sure you want to unlink this relationship?')}</p>
                {errorMessage && (
                    <NoticeBox
                        title={i18n.t('There was a problem unlinking the relationship')}
                        error
                    >
                        {errorMessage}
                    </NoticeBox>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenModal(false)} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button destructive onClick={handleUnlink} disabled={loading}>
                        {i18n.t('Yes, unlink relationship')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
