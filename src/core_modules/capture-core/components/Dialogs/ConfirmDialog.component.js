// @flow
import React from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props } from './confirmDialog.types';

export const ConfirmDialog = ({ open, header, text, confirmText, onConfirm, cancelText, onCancel }: Props) => (
    <Modal hide={!open} onClose={onCancel} small>
        <ModalTitle>
            {header}
        </ModalTitle>
        <ModalContent>
            {text}
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onCancel} secondary>
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} primary>
                    {confirmText}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);

