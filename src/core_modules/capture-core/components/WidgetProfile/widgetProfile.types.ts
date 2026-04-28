export type Props = {
    teiId: string;
    programId: string;
    orgUnitId: string;
    readOnlyMode?: boolean;
    readOnlyTooltipContent?: string;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
};
