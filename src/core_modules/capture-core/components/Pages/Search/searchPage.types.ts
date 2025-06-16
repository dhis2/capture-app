export type Props = {
    programId: string;
    orgUnitId: string;
    onNavigateToMainPage: () => void;
    showBulkDataEntryPlugin: boolean;
    setShowBulkDataEntryPlugin: (show: boolean) => void;
};

export type PlainProps = Props & {
    classes: Record<string, string>;
};
