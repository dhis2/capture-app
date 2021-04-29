// @flow

export type Props = {|
    header: React$Node,
    children: React$Node,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    ...CssClasses,
|};
