// @flow
import { typeof dataElementTypes } from '../../../../metaData';
import type { Categories } from '../../WorkingListsBase';
import type { ApiTrackerQueryCriteria } from './apiTemplate.types';

type TeiRecord = {| [id: string]: any |};

export type TeiRecords = {| [teiId: string]: TeiRecord |};

export type TeiWorkingListsTemplate = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    access: {
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    criteria?: ApiTrackerQueryCriteria,
    notPreserved?: boolean,
    deleted?: boolean,
    updating?: boolean,
    order?: number,
    isAltered?: boolean,
};

export type TeiWorkingListsTemplates = Array<TeiWorkingListsTemplate>;

export type ColumnConfigBase = {|
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Array<{text: string, value: any}>,
    multiValueFilter?: boolean,
    filterHidden?: boolean,
    additionalColumn?: boolean,
|};
export type MetadataColumnConfig = {
    ...ColumnConfigBase,
};

export type MainColumnConfig = {
    ...ColumnConfigBase,
    mainProperty: true,
};

export type TeiWorkingListsColumnConfig = MetadataColumnConfig | MainColumnConfig;

export type TeiWorkingListsColumnConfigs = Array<TeiWorkingListsColumnConfig>;

export type TeiColumnMetaForDataFetching = {
    id: string,
    type: $Values<dataElementTypes>,
    mainProperty?: boolean,
    visible: boolean,
};

export type TeiColumnsMetaForDataFetching = Map<string, TeiColumnMetaForDataFetching>;

export type TeiFilterOnlyMetaForDataFetching = {
    id: string,
    type: $Values<dataElementTypes>,
    transformRecordsFilter: (rawFilter: any) => Object,
};

export type TeiFiltersOnlyMetaForDataFetching = Map<string, TeiFilterOnlyMetaForDataFetching>;

export type LoadTeiView = (
    template: TeiWorkingListsTemplate,
    context: {|
        programId: string,
        orgUnitId: string,
        categories?: Categories,
        programStageId?: string,
        currentRequest?: string,
    |},
    meta: {|
        columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    |},
) => Promise<void> | void;

