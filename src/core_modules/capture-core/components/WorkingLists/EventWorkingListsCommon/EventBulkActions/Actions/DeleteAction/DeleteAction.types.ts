export type Props = {
    selectedRows: { [id: string]: boolean };
    stageDataWriteAccess?: boolean;
    onUpdateList: () => void;
    bulkDataEntryIsActive?: boolean;
};
