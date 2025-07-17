
export type PlainProps = {
    itemId: string;
    dataEntryId: string;
    onOpenAddRelationship: (itemId: string, dataEntryId: string) => void;
    onRemoveRelationship: (itemId: string, dataEntryId: string, relClientId: string) => void;
};

export type MapStateToPropsInput = {
    dataEntryId: string;
};

export type MapDispatchToPropsReturn = {
    onOpenAddRelationship: (itemId: string, dataEntryId: string) => void;
    onRemoveRelationship: (itemId: string, dataEntryId: string, relationshipClientId: string) => void;
};
