import { dataElementTypes } from '../../../../metaData';
import { CHANGE_TYPES, CHANGELOG_ENTITY_TYPES } from './Changelog.constants';

type CreatedChange = {
    type: typeof CHANGE_TYPES.CREATED;
    dataElement?: string;
    attribute?: string;
    field?: string;
    currentValue: any;
};

type UpdatedChange = {
    type: typeof CHANGE_TYPES.UPDATED;
    dataElement?: string;
    attribute?: string;
    field?: string;
    previousValue: any;
    currentValue: any;
};

type DeletedChange = {
    type: typeof CHANGE_TYPES.DELETED;
    dataElement?: string;
    attribute?: string;
    field?: string;
    previousValue: any;
};

export type Change = CreatedChange | DeletedChange | UpdatedChange;

export type ItemDefinition = {
    id: string;
    name: string;
    type: keyof typeof dataElementTypes;
    optionSet?: string;
    options?: Array<{ code: string; name: string }>;
};

export type ItemDefinitions = {
    [key: string]: ItemDefinition;
};

export type SortDirection = 'default' | 'asc' | 'desc';
export type SetSortDirection = (direction: SortDirection) => void;
export type Pager = {
    page: number;
    pageSize: number;
    nextPage: string;
    previous: string;
};

export type ChangelogRecord = {
    reactKey: string;
    date: string;
    user: string;
    username: string;
    dataItemId: string;
    dataItemLabel: string;
    changeType: string;
    previousValue: string;
    currentValue: string;
};

export type ChangelogProps = {
    isOpen: boolean;
    close: () => void;
    pager?: Pager;
    defaultPage: number;
    defaultPageSize: number;
    loading: boolean;
    records?: Array<ChangelogRecord>;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    columnToSortBy: string;
    setColumnToSortBy: (column: string) => void;
    sortDirection: SortDirection;
    setSortDirection: SetSortDirection;
    attributeToFilterBy?: string | null;
    setAttributeToFilterBy: (attribute: string | null) => void;
    filterValue: any;
    setFilterValue: (value: any) => void;
    dataItemDefinitions: ItemDefinitions;
    entityType: typeof CHANGELOG_ENTITY_TYPES[keyof typeof CHANGELOG_ENTITY_TYPES];
    supportsChangelogV2: boolean;
};
