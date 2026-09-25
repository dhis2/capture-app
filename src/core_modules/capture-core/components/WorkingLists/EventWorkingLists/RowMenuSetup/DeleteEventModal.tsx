import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { LabelKeys, useTermLabel } from '../../../../customLabels';

type Props = {
    eventId: string;
    stageId?: string;
    onClose: () => void;
    onConfirmDelete: (eventId: string) => void;
};

export const DeleteEventModal = ({ eventId, stageId, onClose, onConfirmDelete }: Props) => {
    const { eventLabel } = useTermLabel([LabelKeys.eventSingular], { stageId });
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
                {i18n.t('Delete {{eventLabel}}', { eventLabel })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t('Deleting an {{eventLabel}} is permanent and cannot be undone.', { eventLabel })}
                    {' '}
                    {i18n.t('Are you sure you want to delete this {{eventLabel}}?', { eventLabel })}
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
                        {i18n.t('Yes, delete {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
