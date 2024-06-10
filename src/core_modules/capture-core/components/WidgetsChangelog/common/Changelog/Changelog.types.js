// @flow
import { CHANGE_TYPES } from './Changelog.constants';
import { dataElementTypes } from '../../../../metaData';

type CreatedChange = {|
    type: typeof CHANGE_TYPES.CREATED,
    dataElement?: string,
    attribute?: string,
    currentValue: any,
|}

type UpdatedChange = {|
    type: typeof CHANGE_TYPES.UPDATED,
    dataElement?: string,
    attribute?: string,
    previousValue: any,
    currentValue: any,
|}

type DeletedChange = {|
    type: typeof CHANGE_TYPES.DELETED,
    dataElement?: string,
    attribute?: string,
    previousValue: any,
|}

export type Change = CreatedChange | DeletedChange | UpdatedChange;

export type ItemDefinitions = {
    [key: string]: {
        id: string,
        name: string,
        type: $Keys<typeof dataElementTypes>,
        optionSet?: string,
        options?: Array<{ code: string, name: string }>
    },
}

export type SortDirection = 'default' | 'asc' | 'desc';

export type SetSortDirection = (SortDirection) => void;

type Pager = {
    page: number,
    pageSize: number,
    nextPage: string,
    previous: string,
}

export type ChangelogRecord = {
    reactKey: string,
    date: string,
    user: string,
    dataItemId: string,
    dataItemLabel: string,
    changeType: string,
    previousValue: string,
    newValue: string
}

export type ChangelogProps = {
    isOpen: boolean,
    close: () => void,
    pager: ?Pager,
    records: ?Array<ChangelogRecord>,
    setPage: (number) => void,
    setPageSize: (number) => void,
    sortDirection: SortDirection,
    setSortDirection: SetSortDirection,
}
