// @flow
import type {
    TeiFiltersOnlyMetaForDataFetching,
    TeiColumnMetaForDataFetching,
    TeiColumnsMetaForDataFetching,
} from '../../../../types';

const buildFilterQueryArgs = (
    filters?: {| [id: string]: string |} = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
) =>
    Object.keys(filters)
        .filter(filterKey => !filtersOnlyMetaForDataFetching.get(filterKey))
        .flatMap((filterKey) => {
            const filter = filters[filterKey];
            if (Array.isArray(filter)) {
                return filter.map(filterPart => `${filterKey}:${filterPart}`);
            }
            return `${filterKey}:${filter}`;
        });

export const splitFilters = (
    rawFilters?: {| [id: string]: string |} = {},
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching | Map<string, {
        ...TeiColumnMetaForDataFetching,
        additionalColumn?: boolean,
    }>,
) =>
    Object.keys(rawFilters).reduce(
        (acc, filterKey) => {
            if (columnsMetaForDataFetching.get(filterKey)?.additionalColumn) {
                acc.filters[filterKey] = rawFilters[filterKey];
            } else {
                acc.filterAttributes[filterKey] = rawFilters[filterKey];
            }
            return acc;
        },
        { filters: {}, filterAttributes: {} },
    );

export const getApiFilterQueryArgs = (
    filters?: {| [id: string]: string |} = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): ?{| filter: Array<string> |} => {
    const apiFilterQueryArgs = buildFilterQueryArgs(filters, filtersOnlyMetaForDataFetching);
    return apiFilterQueryArgs.length > 0 ? { filter: apiFilterQueryArgs } : null;
};

export const getApiFilterAttributesQueryArgs = (
    filters?: {| [id: string]: string |} = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): ?{| filterAttributes: Array<string> |} => {
    const apiFilterAttributesQueryArgs = buildFilterQueryArgs(filters, filtersOnlyMetaForDataFetching);
    return apiFilterAttributesQueryArgs.length > 0 ? { filterAttributes: apiFilterAttributesQueryArgs } : null;
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
