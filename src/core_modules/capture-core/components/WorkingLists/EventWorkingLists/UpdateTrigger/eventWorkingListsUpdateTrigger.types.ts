import type { LoadView, UpdateList } from '../../WorkingListsBase';
import type { EventWorkingListsRowMenuSetupOutputProps } from '../RowMenuSetup';

type ExtractedProps = {
    lastTransaction: number,
    lastIdDeleted?: string,
    listDataRefreshTimestamp?: number,
    lastTransactionOnListDataRefresh?: number,
    onLoadView: LoadView,
    onUpdateList: any,
};

type RestProps = Omit<EventWorkingListsRowMenuSetupOutputProps & { lastIdDeleted: string; lastTransactionOnListDataRefresh: number; listDataRefreshTimestamp: number },
    keyof (ExtractedProps & { lastIdDeleted: string; lastTransactionOnListDataRefresh: number; listDataRefreshTimestamp: number })>;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsUpdateTriggerOutputProps = RestProps & {
    customUpdateTrigger: string,
    forceUpdateOnMount: boolean,
    onLoadView: LoadView,
    onUpdateList: UpdateList,
};
