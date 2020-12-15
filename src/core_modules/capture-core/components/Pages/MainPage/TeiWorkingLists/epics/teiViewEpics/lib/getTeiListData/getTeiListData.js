// @flow
import { convertToClientTeis } from './convertToClientTeis';
import { getTeisWithSubvalues } from './getTeisWithSubvalues';
import type { RawQueryArgs, RawFilterQueryArgs } from './types';
import type { InputMeta } from './getTeiListData.types';
import type { TeiColumnsMetaForDataFetching } from '../../../../types';

const getApiFilterQueryArgs = (filters?: RawFilterQueryArgs = {}): ?{| filter: Array<string> |} => {
    const apiFilterQueryArgs =
            Object
                .keys(filters)
                .flatMap((filterKey) => {
                    const filter = filters[filterKey];
                    // not handling any main columns yet so this is pretty straight forward
                    if (Array.isArray(filter)) {
                        return filter
                            .map(filterPart => `${filterKey}:${filterPart}`);
                    }
                    return `${filterKey}:${filter}`;
                });

    return (apiFilterQueryArgs.length > 0 ? { filter: apiFilterQueryArgs } : null);
};

const getApiOrderById = (sortById: string, columnsMetaForDataFetching: TeiColumnsMetaForDataFetching) => {
    const { id, apiName } = columnsMetaForDataFetching.get(sortById) || {};
    return apiName || id;
};

const getApiOrderByQueryArgument = (sortById: string, sortByDirection: string, columnsMetaForDataFetching: TeiColumnsMetaForDataFetching) => {
    const apiId = getApiOrderById(sortById, columnsMetaForDataFetching);
    return `${apiId}:${sortByDirection}`;
};


const createApiQueryArgs = ({
    page,
    pageSize,
    programId: program,
    orgUnitId: ou,
    filters,
    sortById,
    sortByDirection,
}: RawQueryArgs,
columnsMetaForDataFetching: TeiColumnsMetaForDataFetching): { [string]: any } => ({
    ...getApiFilterQueryArgs(filters),
    orderBy: getApiOrderByQueryArgument(sortById, sortByDirection, columnsMetaForDataFetching),
    page,
    pageSize,
    ou,
    ouMode: 'SELECTED',
    program,
});

export const getTeiListData = async (
    rawQueryArgs: RawQueryArgs, {
        columnsMetaForDataFetching,
        querySingleResource,
        absoluteApiPath,
    }: InputMeta,
) => {
    const { resource, queryArgs } = {
        resource: 'trackedEntityInstances',
        queryArgs: createApiQueryArgs(rawQueryArgs, columnsMetaForDataFetching),
    };

    const { trackedEntityInstances: apiTeis = [] } = await querySingleResource({
        resource,
        params: queryArgs,
    });
    const columnsMetaForDataFetchingArray = [...columnsMetaForDataFetching.values()];
    const clientTeis = convertToClientTeis(apiTeis, columnsMetaForDataFetchingArray);
    const clientTeisWithSubvalues = await getTeisWithSubvalues(querySingleResource, absoluteApiPath)(clientTeis, columnsMetaForDataFetchingArray);

    return {
        teis: clientTeisWithSubvalues,
        request: {
            resource,
            queryArgs,
        },
    };
};
