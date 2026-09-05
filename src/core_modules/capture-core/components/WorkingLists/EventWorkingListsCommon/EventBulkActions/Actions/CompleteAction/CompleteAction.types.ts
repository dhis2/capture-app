export type Props = {
    selectedRows: { [key: string]: boolean };
    stageDataWriteAccess?: boolean;
    bulkDataEntryIsActive?: boolean;
    onUpdateList: (disableClearSelections?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    programId?: string;
};
