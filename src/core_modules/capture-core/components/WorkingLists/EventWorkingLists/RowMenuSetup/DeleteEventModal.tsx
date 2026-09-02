import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';

type Props = {
    eventId: string;
    programId: string;
    onClose: () => void;
    onConfirmDelete: (eventId: string) => void;
};

export const DeleteEventModal = ({ eventId, programId, onClose, onConfirmDelete }: Props) => {
    const eventLabel = useTermLabel('event', { programId });
    const handleConfirm = () => {
        onConfirmDelete(eventId);
        onClose();
    };

    return (
        <Modal
            onClose={onClose}
            small
        >
            <ModalTitle>
                {customTerms.i18n.t('Delete {{eventLabel}}', { eventLabel })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {customTerms.i18n.t('Deleting an {{eventLabel}} is permanent and cannot be undone.', { eventLabel })}
                    {' '}
                    {customTerms.i18n.t('Are you sure you want to delete this {{eventLabel}}?', { eventLabel })}
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
                        onClick={handleConfirm}
                    >
                        {customTerms.i18n.t('Yes, delete {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
