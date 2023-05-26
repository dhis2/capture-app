// @flow

export type Props = $ReadOnly<{|
    onSearchSelected: () => void,
    onNewSelected: () => void,
    trackedEntityName: string,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
