// @flow

export type Props = {
    open: boolean,
    header: string,
    text: string,
    cancelText: string,
    destructiveText: string,
    onCancel: () => void,
    onDestroy: () => void,
};
