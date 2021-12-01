// @flow
import type { RecordsOrder, CustomColumnOrder } from '../../WorkingListsCommon';
import type { EventRecords } from '../../EventWorkingListsCommon';
import type { EventProgram } from '../../../../metaData';

export type Props = $ReadOnly<{|
    storeId: string,
|}>;

export type EventWorkingListsReduxOfflineOutputProps = $ReadOnly<{|
    eventRecords?: EventRecords,
    recordsOrder?: RecordsOrder,
    customColumnOrder?: CustomColumnOrder,
    program: EventProgram,
|}>;
