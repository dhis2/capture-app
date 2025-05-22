// @flow
export type Props = {
    title: string,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
};

export type PlainProps = {
    title: string,
    onBackToBulkDataEntry: () => void,
    ...CssClasses,
};
