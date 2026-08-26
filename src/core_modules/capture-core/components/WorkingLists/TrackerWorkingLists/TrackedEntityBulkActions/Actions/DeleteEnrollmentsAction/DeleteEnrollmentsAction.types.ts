export type PlainProps = {
    selectedRows: Record<string, boolean>;
    programDataWriteAccess: boolean;
    programId: string;
    onUpdateList: () => void;
    bulkDataEntryIsActive: boolean;
};
