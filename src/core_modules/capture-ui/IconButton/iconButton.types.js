// @flow

export type Props = {
    children: React$Node,
    className?: string,
    dataTest?: string,
    disabled?: boolean,
    onClick: (event: SyntheticKeyboardEvent<HTMLSpanElement> | SyntheticMouseEvent<HTMLSpanElement> | SyntheticTouchEvent<HTMLSpanElement>) => void,
    ...CssClasses,
};
