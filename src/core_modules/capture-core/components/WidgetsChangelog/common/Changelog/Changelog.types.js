// @flow
import { dataElementTypes } from '../../../../metaData';
import { CHANGE_TYPES, CHANGELOG_ENTITY_TYPES } from './Changelog.constants';

type CreatedChange = {|
    type: typeof CHANGE_TYPES.CREATED,
    dataElement?: string,
    attribute?: string,
    field?: string,
    currentValue: any,
|};
type UpdatedChange = {|
    type: typeof CHANGE_TYPES.UPDATED,
    dataElement?: string,
    attribute?: string,
    field?: string,
    previousValue: any,
    currentValue: any,
|};
type DeletedChange = {|
    type: typeof CHANGE_TYPES.DELETED,
    dataElement?: string,
    attribute?: string,
    field?: string,
    previousValue: any,
|};

export type Change = CreatedChange | DeletedChange | UpdatedChange;

export type ItemDefinition = {
    id: string,
    name: string,
    type: $Keys<typeof dataElementTypes>,
    optionSet?: string,
    options?: Array<{ code: string, name: string }>,
};

export type ItemDefinitions = {
    [key: string]: ItemDefinition,
};

export type SortDirection = 'default' | 'asc' | 'desc';
export type SetSortDirection = (SortDirection) => void;
export type Pager = {
    page: number,
    pageSize: number,
    nextPage: string,
    previous: string,
};

export type ChangelogRecord = {
    reactKey: string,
    date: string,
    user: string,
    username: string,
    dataItemId: string,
    dataItemLabel: string,
    changeType: string,
    previousValue: string,
    currentValue: string,
};

export type ChangelogProps = {
    isOpen: boolean,
    close: () => void,
    pager?: Pager,
    records?: Array<ChangelogRecord>,
    setPage: (number) => void,
    setPageSize: (number) => void,
    columnToSortBy: string,
    setColumnToSortBy: (string) => void,
    sortDirection: SortDirection,
    setSortDirection: SetSortDirection,
    attributeToFilterBy?: string | null,
    setAttributeToFilterBy: (string | null) => void,
    filterValue: any,
    setFilterValue: (any) => void,
    dataItemDefinitions: ItemDefinitions,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    supportsChangelogV2: boolean,
};
