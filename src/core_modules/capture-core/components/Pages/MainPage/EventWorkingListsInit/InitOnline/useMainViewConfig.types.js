// @flow
import type { MainViewConfig } from '../../../../WorkingLists/EventWorkingLists';

export type UseMainViewConfig = () => {
    mainViewConfig?: MainViewConfig,
    mainViewConfigReady: boolean,
}

export type DatastoreOccurredAt = {|
    type: 'RELATIVE',
    period?: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR' | 'LAST_WEEK' | 'LAST_MONTH' | 'LAST_3_MONTHS',
    startBuffer?: number,
    endBuffer?: number,
    lockedInAllViews?: boolean,
|};

export type DatastoreWorkingListsEvents = {|
    mainView: {
        occurredAt: DatastoreOccurredAt,
    }
|};

export type DataStoreWorkingLists = {|
    global: {
        event: DatastoreWorkingListsEvents,
    }
|};
