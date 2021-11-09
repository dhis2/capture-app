// @flow

export type Props = {
    open: boolean,
    header: string,
    text: string,
    confirmText: string,
    cancelText: string,
    onCancel: () => void,
    onConfirm: () => void,
};
