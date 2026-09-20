export type Props = {
    selectedRows: { [id: string]: boolean };
    stageDataWriteAccess?: boolean;
    stageId?: string;
    onUpdateList: () => void;
    bulkDataEntryIsActive?: boolean;
};
