
export type PlainProps = {
    itemId: string;
    dataEntryId: string;
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void;
};

export type MapStateToPropsInput = {
    dataEntryId: string;
};
