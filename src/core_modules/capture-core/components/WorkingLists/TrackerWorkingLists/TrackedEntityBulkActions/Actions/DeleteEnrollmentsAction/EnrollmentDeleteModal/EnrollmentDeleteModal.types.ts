export type PlainProps = {
    selectedRows: Record<string, boolean>;
    programId: string;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
};
