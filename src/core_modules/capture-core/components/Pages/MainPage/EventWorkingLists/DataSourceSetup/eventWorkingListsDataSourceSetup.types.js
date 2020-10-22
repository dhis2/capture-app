// @flow
import type { DataSource } from '../../WorkingLists';
import type { EventsMainProperties, EventsDataElementValues, EventWorkingListsColumnConfigs } from '../types';
import type { CurrentViewChangesResolverOutputProps } from '../CurrentViewChangesResolver';

type ExtractedProps = $ReadOnly<{|
    eventsMainProperties: ?EventsMainProperties,
    eventsDataElementValues: ?EventsDataElementValues,
    columns: EventWorkingListsColumnConfigs,
    recordsOrder?: Array<string>,
|}>;

type OptionalExtractedProps = {
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
