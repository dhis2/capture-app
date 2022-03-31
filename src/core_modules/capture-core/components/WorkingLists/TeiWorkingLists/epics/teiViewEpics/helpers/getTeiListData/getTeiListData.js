// @flow
import { convertToClientTeis } from './convertToClientTeis';
import { getTeisWithSubvalues } from './getTeisWithSubvalues';
import type { RawQueryArgs, RawFilterQueryArgs } from './types';
import type { InputMeta } from './getTeiListData.types';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';

const getApiFilterQueryArgs = (
    filters?: RawFilterQueryArgs = {},
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching): ?{| filter: Array<string> |} => {
    const apiFilterQueryArgs =
            Object
                .keys(filters)
                .filter(filterKey => !filtersOnlyMetaForDataFetching.get(filterKey))
                .flatMap((filterKey) => {
                    const filter = filters[filterKey];
                    if (Array.isArray(filter)) {
                        return filter
                            .map(filterPart => `${filterKey}:${filterPart}`);
                    }
                    return `${filterKey}:${filter}`;
                });

    return (apiFilterQueryArgs.length > 0 ? { filter: apiFilterQueryArgs } : null);
};

const getMainApiFilterQueryArgs = (filters?: RawFilterQueryArgs = {}, filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching) =>
    Object
        .keys(filters)
        .filter(filterKey => filtersOnlyMetaForDataFetching.get(filterKey))
        .reduce((acc, filterKey) => {
            const filter = filters[filterKey];
            const { transformRecordsFilter } = filtersOnlyMetaForDataFetching.get(filterKey) || {};
            return {
                ...acc,
                ...transformRecordsFilter(filter),
            };
        }, {});

const createApiQueryArgs = ({
    page,
    pageSize,
    programId: program,
    orgUnitId: orgUnit,
    filters,
    sortById,
    sortByDirection,
}: RawQueryArgs,
columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): { [string]: any } => ({
    ...getApiFilterQueryArgs(filters, filtersOnlyMetaForDataFetching),
    ...getMainApiFilterQueryArgs(filters, filtersOnlyMetaForDataFetching),
    order: `${sortById}:${sortByDirection}`,
    page,
    pageSize,
    orgUnit,
    ouMode: orgUnit ? 'SELECTED' : 'ACCESSIBLE',
    program,
    fields: ':all,programOwners[orgUnit,program]',
});

export const getTeiListData = async (
    rawQueryArgs: RawQueryArgs, {
        columnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching,
        querySingleResource,
        absoluteApiPath,
    }: InputMeta,
) => {
    const { resource, queryArgs } = {
        resource: 'tracker/trackedEntities',
        queryArgs: createApiQueryArgs(rawQueryArgs, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching),
    };

    const { instances: apiTeis = [] } = await querySingleResource({
        resource,
        params: queryArgs,
    });
    const columnsMetaForDataFetchingArray = [...columnsMetaForDataFetching.values()];
    const clientTeis = convertToClientTeis(apiTeis, columnsMetaForDataFetchingArray, rawQueryArgs.programId);
    const clientTeisWithSubvalues = await getTeisWithSubvalues(querySingleResource, absoluteApiPath)(clientTeis, columnsMetaForDataFetchingArray);

    return {
        teis: clientTeisWithSubvalues,
        request: {
            resource,
            queryArgs,
        },
    };
};
