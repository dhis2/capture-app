// @flow
import type { LoadView, UpdateList } from '../../WorkingLists';
import type { EventWorkingListsRowMenuSetupOutputProps } from '../RowMenuSetup';

type ExtractedProps = $ReadOnly<{|
    lastTransaction: number,
    lastIdDeleted?: string,
    listDataRefreshTimestamp?: number,
    lastTransactionOnListDataRefresh?: number,
    onLoadView: Function,
    onUpdateList: Function,
|}>;

type RestProps = $Rest<EventWorkingListsRowMenuSetupOutputProps & { lastIdDeleted: string, lastTransactionOnListDataRefresh: number, listDataRefreshTimestamp: number },
    ExtractedProps & { lastIdDeleted: string, lastTransactionOnListDataRefresh: number, listDataRefreshTimestamp: number }>;

export type Props = $ReadOnly<{|
    ...RestProps,
    ...ExtractedProps,
|}>;

export type EventWorkingListsUpdateTriggerOutputProps = $ReadOnly<{|
    ...RestProps,
    customUpdateTrigger: string,
    forceUpdateOnMount: boolean,
    onLoadView: LoadView,
    onUpdateList: UpdateList,
|}>;
