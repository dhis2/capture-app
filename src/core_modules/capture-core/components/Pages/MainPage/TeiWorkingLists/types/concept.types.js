// @flow
import { typeof dataElementTypes } from '../../../../../metaData';
import type { Categories } from '../../WorkingLists';

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
    notPreserved?: boolean,
    deleted?: boolean,
    updating?: boolean,
};

export type TeiWorkingListsTemplates = Array<TeiWorkingListsTemplate>;

export type ColumnConfigBase = {|
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Array<{text: string, value: any}>,
    multiValueFilter?: boolean,
    disableFilter?: boolean,
|};
export type MetadataColumnConfig = {
    ...ColumnConfigBase,
};

export type MainColumnConfig = {
    ...ColumnConfigBase,
    mainProperty: true,
    apiName?: string,
};

export type TeiWorkingListsColumnConfig = MetadataColumnConfig | MainColumnConfig;

export type TeiWorkingListsColumnConfigs = Array<TeiWorkingListsColumnConfig>;

export type TeiColumnMetaForDataFetching = {
    id: string,
    type: $Values<dataElementTypes>,
    mainProperty?: boolean,
    apiName?: string,
    visible: boolean,
};

export type TeiColumnsMetaForDataFetching = Map<string, TeiColumnMetaForDataFetching>;

export type LoadTeiView = (
    template: TeiWorkingListsTemplate,
    context: {|
        programId: string,
        orgUnitId: string,
        categories?: Categories,
    |},
    meta: {|
        columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    |},
) => void;
