import type { ProgramStage } from '../../../../metaData';
import type { RecordsOrder } from '../../WorkingListsCommon';

type BaseProps = {
    recordsOrder?: RecordsOrder,
    selectedRows: Record<string, boolean>,
    programId: string,
    stages: Map<string, ProgramStage>,
    onClearSelection: () => void,
    programDataWriteAccess: boolean,
    onUpdateList: () => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
    onOpenBulkDataEntryPlugin: (trackedEntityIds: Array<string>) => void,
};

export type Props = BaseProps & {
    onOpenBulkDataEntryPlugin: () => void,
    bulkDataEntryIsActive: boolean,
};

export type ContainerProps = BaseProps & {
    programStageId?: string,
};
