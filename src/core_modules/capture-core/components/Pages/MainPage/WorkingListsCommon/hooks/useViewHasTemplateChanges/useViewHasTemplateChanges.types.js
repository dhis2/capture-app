// @flow
import type { FiltersData } from '../../../WorkingLists';

type Column = {
    id: string,
    visible: boolean,
    [string]: any,
};

type Columns = Array<Column>;

export type InitialViewConfig = {
    filters: FiltersData,
    visibleColumnIds: Array<string>,
    sortById: string,
    sortByDirection: string,
};

export type CurrentViewConfig = {
    filters: FiltersData,
    columns: Columns,
    sortById: string,
    sortByDirection: string,
};

export type Input = {
    initialViewConfig?: {
        filters?: FiltersData,
        customVisibleColumnIds?: Array<string>,
        sortById?: string,
        sortByDirection?: string,
    },
    defaultColumns: Columns,
    filters?: FiltersData,
    columns: Columns,
    sortById?: string,
    sortByDirection?: string,
};
