// @flow
import type { FiltersData, ColumnConfigs } from '../../WorkingLists';

export type CurrentViewConfig = {
    filters: FiltersData,
    columns: ColumnConfigs,
    sortById: string,
    sortByDirection: string,
};

export type InitialViewConfig = {
    filters: FiltersData,
    visibleColumnIds: Array<string>,
    sortById: string,
    sortByDirection: string,
};

export type Props = $ReadOnly<{
    filters?: FiltersData,
    columns: ColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    initialViewConfig?: {
        filters?: FiltersData,
        visibleCustomColumnIds?: Array<string>,
        sortById?: string,
        sortByDirection?: string,
    },
    defaultColumns: ColumnConfigs,
}>;
