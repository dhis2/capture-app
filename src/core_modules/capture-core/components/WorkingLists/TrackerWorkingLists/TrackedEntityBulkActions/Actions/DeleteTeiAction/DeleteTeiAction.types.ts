export type PlainProps = {
    selectedRows: Record<string, boolean>;
    selectedRowsCount: number;
    trackedEntityName: string;
    onUpdateList: () => void;
};
