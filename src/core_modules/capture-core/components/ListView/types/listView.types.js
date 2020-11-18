// @flow

import { dataElementTypes } from '../../../metaData';
import type {
    FilterData,
    Options,
} from '../../FiltersForTypes';

export type Column = {
    id: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    header: string,
    options?: ?Options,
    multiValueFilter?: boolean,
};

export type Columns = Array<Column>;

export type DataSourceItem = { [id: string]: string };

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
    rowsCount: number,
};

export type StickyFilters =
    { userSelectedFilters: ?{ [id: string]: boolean }, filtersWithValueOnInit: ?{ [id: string]: boolean } };

export type ChangePage = (pageNumber: number) => void;
export type ChangeRowsPerPage = (rowsPerPage: number) => void;
export type UpdateFilter = (data: ?Object, id: string) => void;
export type ClearFilter = (id: string) => void;
export type SelectRestMenuItem = (id: string) => void;
export type SetColumnOrder = (columns: Columns) => void;
export type SelectRow = (rowData: DataSourceItem) => void;
export type Sort = (id: string, direction: string) => void;
export type InterfaceProps = $ReadOnly<{|
    columns?: Columns,
    currentPage: number,
    customMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    dataSource: DataSource,
    filters: FiltersData,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    onClearFilter: ClearFilter,
    onSelectRestMenuItem: SelectRestMenuItem,
    onSelectRow: SelectRow,
    onSetColumnOrder: SetColumnOrder,
    onSort: Sort,
    onUpdateFilter: UpdateFilter,
    rowIdKey: string,
    rowsCount: number,
    rowsPerPage: number,
    sortById: string,
    sortByDirection: string,
    stickyFilters: StickyFilters,
    updating: boolean,
    updatingWithDialog: boolean,
|}>;

export type ListViewPassOnProps = $ReadOnly<{|
    ...InterfaceProps,
    columns: Columns,
|}>;
