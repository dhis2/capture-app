import type { ProgramStage } from '../../../../metaData';

export type Props = {
    selectedRows: { [key: string]: boolean };
    onClearSelection: () => void;
    stage: ProgramStage;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    programId?: string;
    onOpenBulkDataEntryPlugin?: () => void;
    bulkDataEntryIsActive?: boolean;
};
