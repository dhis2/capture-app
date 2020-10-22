// @flow
import type { DataSource } from '../../WorkingLists';
import type { EventsMainProperties, EventsDataElementValues, EventWorkingListsColumnConfigs } from '../types';
import type { CurrentViewChangesResolverOutputProps } from '../CurrentViewChangesResolver';

type ExtractedProps = $ReadOnly<{|
    eventsMainProperties: ?EventsMainProperties,
    eventsDataElementValues: ?EventsDataElementValues,
    columns: EventWorkingListsColumnConfigs,
|}>;

type RestProps = $Rest<CurrentViewChangesResolverOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsDataSourceSetupOutputProps = {|
    ...RestProps,
    columns: EventWorkingListsColumnConfigs,
    dataSource: DataSource,
    rowIdKey: string,
|};
