// @flow

export type Props = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    onNavigateToMainPage: () => void,
    showBulkDataEntryPlugin: boolean,
    onOpenBulkDataEntryPlugin: () => void,
    onCloseBulkDataEntryPlugin: () => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

