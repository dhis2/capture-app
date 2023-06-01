// @flow

export type Props = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    onNavigateToMainPage: () => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

