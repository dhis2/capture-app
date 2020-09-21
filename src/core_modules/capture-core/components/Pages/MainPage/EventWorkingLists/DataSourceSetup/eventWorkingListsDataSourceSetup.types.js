// @flow
import type { ColumnConfigs } from '../../WorkingLists';
import type { EventsMainProperties, EventsDataElementValues } from '../types';

export type Props = $ReadOnly<{
    eventsMainProperties: ?EventsMainProperties,
    eventsDataElementValues: ?EventsDataElementValues,
    columns: ColumnConfigs,
}>;
