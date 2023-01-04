// @flow

export type Props = {
    open: boolean,
    header: string,
    text: string,
    confirmText?: string,
    cancelText: string,
    destructiveText?: string,
    onCancel: () => void,
    onConfirm?: () => void,
    onDestroy?: () => void,
};
