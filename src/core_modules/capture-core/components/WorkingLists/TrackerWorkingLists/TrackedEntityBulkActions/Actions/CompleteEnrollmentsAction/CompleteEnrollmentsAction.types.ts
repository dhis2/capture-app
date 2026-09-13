import type { ProgramStage } from '../../../../../../metaData';

export type PlainProps = {
    selectedRows: Record<string, any>;
    programId: string;
    stages: Map<string, ProgramStage>;
    programDataWriteAccess: boolean;
    onUpdateList: (disableClearSelections?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    bulkDataEntryIsActive: boolean;
};
