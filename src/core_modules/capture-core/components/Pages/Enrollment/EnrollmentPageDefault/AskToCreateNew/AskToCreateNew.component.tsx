import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { LabelKeys, useTermLabel } from '../../../../../customLabels';

type Props = {
    stageId: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export const AskToCreateNewComponent = ({ stageId, onCancel, onConfirm }: Props) => {
    const { eventLabel } = useTermLabel([LabelKeys.eventSingular], { stageId });

    return (
        <Modal dataTest="modal-ask-to-create-new" onClose={onCancel}>
            <ModalTitle>
                {i18n.t('Generate new {{eventLabel}}', { eventLabel })}
            </ModalTitle>
            <ModalContent>
                {i18n.t('Do you want to create another {{eventLabel}}?', { eventLabel })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button onClick={onConfirm} primary>
                        {i18n.t('Yes, create new {{eventLabel}}', { eventLabel })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
