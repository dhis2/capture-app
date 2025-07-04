export type Props = {
    title: string;
    setShowBulkDataEntryPlugin: (show: boolean) => void;
};

type CssClasses = {
    classes: Record<string, string>;
};

export type PlainProps = {
    title: string;
    onBackToBulkDataEntry: () => void;
} & CssClasses;
