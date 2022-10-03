// @flow

import type { TeiFiltersOnlyMetaForDataFetching } from '../../../../types';

export const getApiFilterQueryArgs = (
    filters?: {| [id: string]: string |} = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): ?{| filter: Array<string> |} => {
    const apiFilterQueryArgs = Object.keys(filters)
        .filter(filterKey => !filtersOnlyMetaForDataFetching.get(filterKey))
        .flatMap((filterKey) => {
            const filter = filters[filterKey];
            if (Array.isArray(filter)) {
                return filter.map(filterPart => `${filterKey}:${filterPart}`);
            }
            return `${filterKey}:${filter}`;
        });

    return apiFilterQueryArgs.length > 0 ? { filter: apiFilterQueryArgs } : null;
};

export const getMainApiFilterQueryArgs = (
    filters?: {| [id: string]: string |} = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
) =>
    Object.keys(filters)
        .filter(filterKey => filtersOnlyMetaForDataFetching.get(filterKey))
        .reduce((acc, filterKey) => {
            const filter = filters[filterKey];
            const { transformRecordsFilter } = filtersOnlyMetaForDataFetching.get(filterKey) || {};
            return {
                ...acc,
                ...transformRecordsFilter(filter),
            };
        }, {});
