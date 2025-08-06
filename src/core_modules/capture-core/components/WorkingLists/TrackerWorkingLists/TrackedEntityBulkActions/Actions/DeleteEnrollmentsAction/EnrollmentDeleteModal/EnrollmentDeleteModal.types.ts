export type PlainProps = {
    selectedRows: Record<string, boolean>;
    programId: string;
    onUpdateList: () => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
};
