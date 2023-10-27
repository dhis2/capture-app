// @flow

export type Props = {
    children: React$Node,
    className?: string,
    dataTest?: string,
    disabled?: boolean,
    onClick: (event: SyntheticKeyboardEvent<HTMLButtonElement> | SyntheticMouseEvent<HTMLButtonElement> | SyntheticTouchEvent<HTMLButtonElement>) => void,
    ...CssClasses,
};
