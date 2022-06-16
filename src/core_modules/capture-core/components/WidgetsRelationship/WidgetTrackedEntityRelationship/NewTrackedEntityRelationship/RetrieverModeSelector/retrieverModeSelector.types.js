// @flow

export type Props = $ReadOnly<{|
    onSearchSelected: () => void,
    onNewSelected: () => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
