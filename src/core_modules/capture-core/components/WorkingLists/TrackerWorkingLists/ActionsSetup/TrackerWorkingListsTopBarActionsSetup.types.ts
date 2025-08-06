import type { TrackerProgram } from '../../../../metaData';
import type { RecordsOrder } from '../../WorkingListsCommon';

export type TrackerWorkingListsTopBarActionsSetupOutputProps = {
    onOpenBulkDataEntryPlugin: (trackedEntityIds: string[]) => void;
    program: TrackerProgram;
    selectionInProgress: boolean;
    recordsOrder?: RecordsOrder;
    customUpdateTrigger?: string;
    customTopBarActions?: any;
    customListViewMenuContents?: any;
    onLoadView?: any;
    onUpdateList?: any;
    allRowsAreSelected?: boolean;
    selectedRows?: { [key: string]: boolean };
    onRowSelect?: (id: string) => void;
    onSelectAll?: (rows: string[]) => void;
    bulkActionBarComponent?: any;
};

export type Props = TrackerWorkingListsTopBarActionsSetupOutputProps;
