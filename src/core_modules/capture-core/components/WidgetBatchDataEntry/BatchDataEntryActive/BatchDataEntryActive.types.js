// @flow
export type Props = {
    title: string,
    setShowBatchDataEntryPlugin: (show: boolean) => void,
};

export type PlainProps = {
    title: string,
    onBackToBatchDataEntry: () => void,
    ...CssClasses,
};
