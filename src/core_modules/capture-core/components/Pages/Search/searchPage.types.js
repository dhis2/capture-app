// @flow

export type Props = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    onNavigateToMainPage: () => void,
    showBulkDataEntryPlugin: boolean,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

