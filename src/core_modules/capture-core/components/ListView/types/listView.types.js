// @flow

import { dataElementTypes, OptionSet } from '../../../metaData';
import type {
    FilterData,
} from '../../FiltersForTypes';

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    optionSet?: OptionSet,
    singleSelect?: ?boolean,
};

export type Columns = Array<Column>;

type DataSourceItem = { [id: string]: string };

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

export type InterfaceProps = $ReadOnly<{
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    rowsPerPage: number,
    currentPage: number,
    rowsCount: number,
    onFilterUpdate: Function,
    onClearFilter: Function,
    filters?: FiltersData,
    onRestMenuItemSelected: Function,
    stickyFilters: StickyFilters,
    columns?: Columns,
    dataSource: DataSource,
    onSetColumnOrder: Function,
    rowIdKey: string,
    customMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    sortById: string,
    sortByDirection: string,
}>;
