export type PlainProps = {
    selectedRows: Record<string, boolean>;
    programDataWriteAccess: boolean;
    programId: string;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    bulkDataEntryIsActive: boolean;
};
