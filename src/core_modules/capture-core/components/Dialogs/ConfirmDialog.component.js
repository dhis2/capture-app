// @flow
import React from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props } from './confirmDialog.types';

export const ConfirmDialog = ({
    open, header, text, confirmText, onConfirm, cancelText, onCancel, destructiveText, onDestroy,
}: Props) => (
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
                {confirmText ? <Button onClick={onConfirm} primary>
                    {confirmText}
                </Button> : null }
                {destructiveText ? <Button onClick={onDestroy} destructive>
                    {destructiveText}
                </Button> : null}
            </ButtonStrip>
        </ModalActions>
    </Modal>
);

