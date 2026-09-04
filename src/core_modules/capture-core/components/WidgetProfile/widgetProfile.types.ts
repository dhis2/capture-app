export type Props = {
    teiId: string;
    programId: string;
    programOwnerId: string;
    readOnlyMode?: boolean;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
};
