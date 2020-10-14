// @flow
import type { ColumnConfigs, DataSource } from '../../WorkingLists';
import type { EventsMainProperties, EventsDataElementValues } from '../types';
import type { CurrentViewChangesResolverOutputProps } from '../CurrentViewChangesResolver';

type ExtractedProps = $ReadOnly<{|
    eventsMainProperties: ?EventsMainProperties,
    eventsDataElementValues: ?EventsDataElementValues,
    columns: ColumnConfigs,
|}>;

type RestProps = $Rest<CurrentViewChangesResolverOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsDataSourceSetupOutputProps = {|
    ...RestProps,
    columns: ColumnConfigs,
    dataSource: DataSource,
    rowIdKey: string,
|};
