// @flow
import type { EventProgram } from '../../../../metaData';
import type { CustomColumnOrder } from '../../WorkingListsCommon';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsReduxOfflineOutputProps } from '../Redux';

type ExtractedProps = {|
    program: EventProgram,
    customColumnOrder?: CustomColumnOrder,
|};

type RestProps =$Rest<EventWorkingListsReduxOfflineOutputProps & { customColumnOrder: CustomColumnOrder },
    ExtractedProps & { customColumnOrder: CustomColumnOrder }>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsOfflineColumnSetupOutputProps = {|
    ...RestProps,
    columns: EventWorkingListsColumnConfigs,
|};
