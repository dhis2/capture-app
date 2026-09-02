import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

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
                        onClick={onClose}
                    >
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        onClick={handleConfirm}
                    >
                        {tCustomTerm('Yes, delete {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
