// @flow
import type { DataSource } from '../../../List';
import type { EventRecords, EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsOfflineColumnSetupOutputProps } from '../ColumnSetup';

type ExtractedProps = $ReadOnly<{|
    eventRecords?: EventRecords,
    columns: EventWorkingListsColumnConfigs,
    recordsOrder?: Array<string>,
|}>;

type OptionalExtractedProps = {
    eventRecords: EventRecords,
    recordsOrder: Array<string>,
};
type RestProps = $Rest<EventWorkingListsOfflineColumnSetupOutputProps & OptionalExtractedProps,
ExtractedProps & OptionalExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsOfflineDataSourceSetupOutputProps = $ReadOnly<{|
    ...RestProps,
    dataSource?: DataSource,
    columns: EventWorkingListsColumnConfigs,
    rowIdKey: string,
    hasData: boolean,
|}>;
