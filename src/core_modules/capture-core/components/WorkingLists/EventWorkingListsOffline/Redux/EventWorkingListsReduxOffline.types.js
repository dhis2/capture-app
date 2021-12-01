// @flow
import type { EventProgram } from '../../../../metaData';
import type { EventRecords } from '../../EventWorkingListsCommon';
import type { RecordsOrder, CustomColumnOrder } from '../../WorkingListsCommon';

export type Props = $ReadOnly<{|
    storeId: string,
|}>;

export type EventWorkingListsReduxOfflineOutputProps = $ReadOnly<{|
    eventRecords?: EventRecords,
    recordsOrder?: RecordsOrder,
    customColumnOrder?: CustomColumnOrder,
    program: EventProgram,
|}>;
