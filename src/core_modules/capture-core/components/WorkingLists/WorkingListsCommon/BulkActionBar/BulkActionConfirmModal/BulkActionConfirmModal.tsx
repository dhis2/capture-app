import React, { type ReactNode } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';

type Props = {
    title: ReactNode;
    children: ReactNode;
    confirmLabel: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    isPending?: boolean;
    confirmDisabled?: boolean;
    dataTest?: string;
};

export const BulkActionConfirmModal = ({
    title,
    children,
    confirmLabel,
    onConfirm,
    onCancel,
    isPending = false,
    confirmDisabled = false,
    dataTest,
}: Props) => (
    <Modal
        small
        onClose={onCancel}
        dataTest={dataTest}
    >
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>{children}</ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button
                    secondary
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>
                <Button
                    destructive
                    onClick={onConfirm}
                    loading={isPending}
                    disabled={confirmDisabled}
                >
                    {confirmLabel}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
