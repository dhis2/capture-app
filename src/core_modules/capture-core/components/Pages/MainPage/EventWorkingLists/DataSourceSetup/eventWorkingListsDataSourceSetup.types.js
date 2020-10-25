// @flow
import type { DataSource } from '../../WorkingLists';
import type { EventRecords, EventWorkingListsColumnConfigs } from '../types';
import type { CurrentViewChangesResolverOutputProps } from '../CurrentViewChangesResolver';

type ExtractedProps = $ReadOnly<{|
    eventRecords?: EventRecords,
    columns: EventWorkingListsColumnConfigs,
    recordsOrder?: Array<string>,
|}>;

type OptionalExtractedProps = {
    eventRecords: EventRecords,
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
