export type Props = {
    selectedRows: Record<string, boolean>;
    stageDataWriteAccess?: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    bulkDataEntryIsActive?: boolean;
    programId?: string;
};
