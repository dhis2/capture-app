// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';

type Props = {
    open: boolean,
    onClose: () => void,
    onDeleteTemplate: () => void,
    templateName: string,
};

export const DeleteConfirmationDialog = (props: Props) => {
    const {
        open,
        onClose,
        onDeleteTemplate,
        templateName,
    } = props;

    if (!open) {
        return null;
    }

    return (
        <Modal
            hide={!open}
            onClose={onClose}
        >
            <ModalTitle>{i18n.t('Delete view')}</ModalTitle>
            <ModalContent>
                {i18n.t('Do you really want to delete the \'{{templateName}}\' view?', { templateName })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={onDeleteTemplate} primary>
                        {i18n.t('Confirm')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

