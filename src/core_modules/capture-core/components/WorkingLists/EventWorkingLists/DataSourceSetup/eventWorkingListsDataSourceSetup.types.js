// @flow
import type { DataSource } from '../../WorkingListsBase';
import type { EventRecords, EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { CurrentViewChangesResolverOutputProps } from '../CurrentViewChangesResolver';

type ExtractedProps = $ReadOnly<{|
    records?: EventRecords,
    columns: EventWorkingListsColumnConfigs,
    recordsOrder?: Array<string>,
|}>;

type OptionalExtractedProps = {
    records: EventRecords,
    recordsOrder: Array<string>,
};
type RestProps = $Rest<CurrentViewChangesResolverOutputProps & OptionalExtractedProps,
ExtractedProps & OptionalExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsDataSourceSetupOutputProps = {|
    ...RestProps,
    columns: EventWorkingListsColumnConfigs,
    dataSource?: DataSource,
    rowIdKey: string,
|};
