// @flow
import type { FiltersData } from '../../../WorkingLists';
import type { InitialViewConfig } from '../../types';

type Column = {|
    id: string,
    visible: boolean,
    [string]: any,
|};

type Columns = Array<Column>;

export type InitialViewConfigComputed = {|
    filters: FiltersData,
    visibleColumnIds: Array<string>,
    sortById: string,
    sortByDirection: string,
|};

export type CurrentViewConfig = {|
    filters: FiltersData,
    columns: Columns,
    sortById: string,
    sortByDirection: string,
|};

export type Input = {|
    initialViewConfig?: InitialViewConfig,
    defaultColumns: Columns,
    filters?: FiltersData,
    columns: Columns,
    sortById?: string,
    sortByDirection?: string,
|};
