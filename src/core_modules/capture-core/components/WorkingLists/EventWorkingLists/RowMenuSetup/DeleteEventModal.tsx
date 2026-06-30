import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useProgramLabel } from '../../../../metaData';

type Props = {
    eventId: string;
    onClose: () => void;
    onConfirmDelete: (eventId: string) => void;
};

export const DeleteEventModal = ({ eventId, onClose, onConfirmDelete }: Props) => {
    const event = useProgramLabel('event') ?? i18n.t('event');
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
                {i18n.t('Delete {{event}}', { event })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t('Deleting this {{event}} is permanent and cannot be undone.', { event })}
                    {' '}
                    {i18n.t('Are you sure you want to delete this {{event}}?', { event })}
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
                        {i18n.t('Yes, delete {{event}}', { event })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
