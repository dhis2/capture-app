export type Props = {
    teiId: string;
    programId: string;
    orgUnitId: string;
    readOnlyMode?: boolean;
    ruleEffects?: Array<{ type: string; id: string; [key: string]: any }>;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
};
