// @flow

import { typeof dataElementTypes } from '../../../metaData';
import type {
    FilterData,
    Options,
} from '../../FiltersForTypes';

export type Column = {
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Options,
    multiValueFilter?: boolean,
    filterHidden?: boolean,
    additionalColumn?: boolean,
};

export type Columns = Array<Column>;

export type FilterOnly = {
    id: string,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Options,
    multiValueFilter?: boolean,
    tooltipContent?: string,
    disabled?: boolean,
    showInMoreFilters?: boolean,
    transformRecordsFilter: (rawFilter: any) => Object,
};

export type AdditionalFilter = {
    ...FilterOnly,
    mainButton?: boolean
};

export type FiltersOnly = Array<FilterOnly>;
export type AdditionalFilters = Array<AdditionalFilter>;
export type DataSourceItem = {| [id: string]: string |};

export type DataSource = Array<DataSourceItem>;

type CustomMenuContentItem = {|
    key: string,
    clickHandler?: Function,
    element: React$Node,
|};

type CustomMenuContentHeader = {|
    key: string,
    subHeader: React$Node,
|};

export type CustomMenuContent = CustomMenuContentItem | CustomMenuContentHeader;

export type CustomMenuContents = Array<CustomMenuContent>;

export type CustomRowMenuContent = {|
    key: string,
    clickHandler?: ?(rowData: DataSourceItem) => any,
    element: React$Node,
|};
export type CustomRowMenuContents = Array<CustomRowMenuContent>;

export type FiltersData = { [id: string]: FilterData };

export type PaginationContextData = {
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    rowsPerPage: number,
    currentPage: number,
    rowCountPage: number,
};

export type StickyFilters =
    { userSelectedFilters: ?{ [id: string]: boolean }, filtersWithValueOnInit: ?{ [id: string]: boolean } };

export type ChangePage = (pageNumber: number) => void;
export type ChangeRowsPerPage = (rowsPerPage: number) => void;
export type UpdateFilter = (data: ?Object, id: string) => void;
export type ClearFilter = (id: string) => void;
export type ClearFilters = (filterIds: Object) => void;
export type RemoveFilter = (id: string, includeFilters: Object) => void;
export type SelectRestMenuItem = (id: string) => void;
export type SetColumnOrder = (columns: Columns) => void;
export type ResetColumnOrder = () => void;
export type SelectRow = (rowData: DataSourceItem) => void;
export type Sort = (id: string, direction: string) => void;
export type InterfaceProps = $ReadOnly<{|
    columns?: Columns,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    currentPage: number,
    customMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    dataSource: DataSource,
    filters: FiltersData,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    onClearFilter: ClearFilter,
    onRemoveFilter: RemoveFilter,
    onSelectRestMenuItem: SelectRestMenuItem,
    onSelectRow: SelectRow,
    onSetColumnOrder: SetColumnOrder,
    onSort: Sort,
    onUpdateFilter: UpdateFilter,
    rowIdKey: string,
    rowsPerPage: number,
    sortById: string,
    sortByDirection: string,
    stickyFilters: StickyFilters,
    updating: boolean,
    updatingWithDialog: boolean,
    programStageId?: string
|}>;

export type ListViewPassOnProps = $ReadOnly<{|
    ...InterfaceProps,
    columns: Columns,
|}>;
