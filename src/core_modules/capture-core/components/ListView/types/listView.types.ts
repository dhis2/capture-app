import type { ReactNode, ReactElement } from 'react';
import type { dataElementTypes } from '../../../metaData';
import type { FilterData, Options } from '../../FiltersForTypes';

export type Column = {
    id: string;
    visible: boolean;
    type: typeof dataElementTypes[keyof typeof dataElementTypes];
    header: string;
    options?: Options;
    multiValueFilter?: boolean;
    filterHidden?: boolean;
    additionalColumn?: boolean;
    unique?: boolean;
    searchOperator?: string;
    minCharactersToSearch?: number;
};

export type Columns = Array<Column>;

export type FilterOnly = {
    id: string;
    type: typeof dataElementTypes[keyof typeof dataElementTypes];
    header: string;
    options?: Options;
    multiValueFilter?: boolean;
    tooltipContent?: string;
    disabled?: boolean;
    showInMoreFilters?: boolean;
    transformRecordsFilter: (rawFilter: any) => any;
};

export type AdditionalFilter = FilterOnly & {
    mainButton?: boolean;
};

export type FiltersOnly = Array<FilterOnly>;
export type AdditionalFilters = Array<AdditionalFilter>;
export type DataSourceItem = { [id: string]: string };

export type DataSource = Array<DataSourceItem>;

type CustomMenuContentItem = {
    key: string;
    clickHandler?: () => void;
    element: ReactNode;
};

type CustomMenuContentHeader = {
    key: string;
    subHeader: ReactNode;
};

export type CustomMenuContent = CustomMenuContentItem | CustomMenuContentHeader;

export type CustomMenuContents = Array<CustomMenuContent>;

export type CustomRowMenuContent = {
    key: string;
    clickHandler?: (rowData: DataSourceItem) => any;
    icon?: ReactNode;
    label: string;
    tooltipContent?: (rowData: DataSourceItem) => string | null;
    tooltipEnabled?: (rowData: DataSourceItem) => boolean;
    disabled?: (rowData: DataSourceItem) => boolean;
};
export type CustomRowMenuContents = Array<CustomRowMenuContent>;

export type CustomTopBarActions = Array<{key: string, actionContents: ReactNode}>;

export type FiltersData = { [id: string]: FilterData };

export type PaginationContextData = {
    onChangePage: (pageNumber: number) => void;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
    rowsPerPage: number;
    currentPage: number;
    rowCountPage: number;
};

export type StickyFilters = {
    userSelectedFilters?: { [id: string]: boolean };
    filtersWithValueOnInit?: { [id: string]: boolean };
};

export type ChangePage = (pageNumber: number) => void;
export type ChangeRowsPerPage = (rowsPerPage: number) => void;
export type UpdateFilter = (data: any, id: string) => void;
export type ClearFilter = (id: string) => void;
export type ClearFilters = (filterIds: any) => void;
export type RemoveFilter = (id: string, includeFilters?: any) => void;
export type SelectRestMenuItem = (id: string) => void;
export type SetColumnOrder = (columns: Columns) => void;
export type ResetColumnOrder = () => void;
export type SelectRow = (rowData: DataSourceItem) => void;
export type Sort = (id: string, direction: string) => void;
export type InterfaceProps = {
    columns?: Columns;
    filtersOnly?: FiltersOnly;
    additionalFilters?: AdditionalFilters;
    currentPage: number;
    customMenuContents?: CustomMenuContents;
    customRowMenuContents?: CustomRowMenuContents;
    customTopBarActions?: CustomTopBarActions;
    dataSource: DataSource;
    filters: FiltersData;
    onChangePage: ChangePage;
    onChangeRowsPerPage: ChangeRowsPerPage;
    onClearFilter: ClearFilter;
    onRemoveFilter: RemoveFilter;
    onSelectRestMenuItem: SelectRestMenuItem;
    onClickListRow: SelectRow;
    onSetColumnOrder: SetColumnOrder;
    onSort: Sort;
    onUpdateFilter: UpdateFilter;
    rowIdKey: string;
    rowsPerPage: number;
    sortById: string;
    sortByDirection: string;
    stickyFilters: StickyFilters;
    updating: boolean;
    onRowSelect: (id: string) => void;
    programStageId?: string;
    selectedRows: { [key: string]: boolean };
    onSelectAll: (rows: Array<string>) => void;
    allRowsAreSelected: boolean;
    selectionInProgress?: boolean;
    bulkActionBarComponent: ReactElement<any>;
};

export type ListViewPassOnProps = InterfaceProps & {
    columns: Columns;
};
