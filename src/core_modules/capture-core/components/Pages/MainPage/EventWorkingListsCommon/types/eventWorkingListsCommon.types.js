// @flow
import { typeof dataElementTypes } from '../../../../../metaData';

type EventRecord = {| [id: string]: any |};

export type EventRecords = {| [eventId: string]: EventRecord |};

export type ColumnConfigBase = {|
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Array<{text: string, value: any}>,
    multiValueFilter?: boolean,
|};
export type MetadataColumnConfig = {
    ...ColumnConfigBase,
};

export type MainColumnConfig = {
    ...ColumnConfigBase,
    isMainProperty: true,
    apiName?: string,
};

export type EventWorkingListsColumnConfig = MetadataColumnConfig | MainColumnConfig;

export type EventWorkingListsColumnConfigs = Array<EventWorkingListsColumnConfig>;
