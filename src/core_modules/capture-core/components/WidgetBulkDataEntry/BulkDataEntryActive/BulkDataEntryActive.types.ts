export type Props = {
    title: string;
    onOpenBulkDataEntryPlugin: () => void;
};

type CssClasses = {
    classes: Record<string, string>;
};

export type PlainProps = {
    title: string;
    onBackToBulkDataEntry: () => void;
} & CssClasses;
