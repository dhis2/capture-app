// @flow
import React, { Component } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';

type Props = {
    open: boolean,
    header: string,
    text: string,
    confirmText: string,
    cancelText: string,
    onCancel: () => void,
    onConfirm: () => void,
};
export class ConfirmDialog extends Component<Props> {
    render() {
        const {
            open,
            header,
            text,
            confirmText,
            onConfirm,
            cancelText,
            onCancel,
        } = this.props;

        return (
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
    }
}
