import type { EventProgram } from '../../../../metaData';
import type { CustomColumnOrder } from '../../WorkingListsCommon';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsReduxOfflineOutputProps } from '../Redux';

type ExtractedProps = {
    program: EventProgram;
    customColumnOrder?: CustomColumnOrder;
};

type OptionalExtractedProps = {
    customColumnOrder: CustomColumnOrder
}

type RestProps = EventWorkingListsReduxOfflineOutputProps & OptionalExtractedProps | ExtractedProps;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsOfflineColumnSetupOutputProps = RestProps & {
    columns: EventWorkingListsColumnConfigs;
};
