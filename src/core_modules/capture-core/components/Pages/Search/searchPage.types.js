// @flow

export type Props = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    onNavigateToMainPage: () => void,
    showBatchDataEntryPlugin: boolean,
    setShowBatchDataEntryPlugin: (show: boolean) => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

