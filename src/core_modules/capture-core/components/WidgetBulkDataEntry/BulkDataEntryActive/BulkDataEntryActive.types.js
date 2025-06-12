// @flow
export type Props = {
    title: string,
    onOpenBulkDataEntryPlugin: () => void,
};

export type PlainProps = {
    title: string,
    onBackToBulkDataEntry: () => void,
    ...CssClasses,
};
