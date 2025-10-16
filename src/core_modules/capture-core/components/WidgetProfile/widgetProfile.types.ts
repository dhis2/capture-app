export type Props = {
    teiId: string;
    programId: string;
    orgUnitId: string;
    enrollmentId?: string;
    readOnlyMode?: boolean;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
};
