// @flow

export type Props = {
    children: React$Node,
    className?: string,
    dataTest?: string,
    onClick: (event: SyntheticKeyboardEvent<HTMLSpanElement> | SyntheticMouseEvent<HTMLSpanElement> | SyntheticTouchEvent<HTMLSpanElement>) => void,
};
