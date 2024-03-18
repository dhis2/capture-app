// @flow
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { convertToClientTeis } from './convertToClientTeis';
import { getSubvalues, getApiFilterQueryArgs, getMainApiFilterQueryArgs } from '../getListDataCommon';
import type { RawQueryArgs } from './types';
import type { InputMeta } from './getTeiListData.types';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';

export const createApiQueryArgs = ({
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
    fields: ':all,!relationships,programOwners[orgUnit,program]',
});

export const getTeiListData = async (
    rawQueryArgs: RawQueryArgs, {
        columnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching,
        querySingleResource,
        absoluteApiPath,
    }: InputMeta,
) => {
    const { url, queryParams } = {
        url: 'tracker/trackedEntities',
        queryParams: createApiQueryArgs(rawQueryArgs, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching),
    };

    const apiResponse = await querySingleResource({
        resource: url,
        params: queryParams,
    });
    const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, apiResponse);
    const columnsMetaForDataFetchingArray = [...columnsMetaForDataFetching.values()];
    const clientTeis = convertToClientTeis(apiTrackedEntities, columnsMetaForDataFetchingArray, rawQueryArgs.programId);
    const clientTeisWithSubvalues = await getSubvalues(querySingleResource, absoluteApiPath)(clientTeis, columnsMetaForDataFetchingArray);

    return {
        recordContainers: clientTeisWithSubvalues,
        request: {
            url,
            queryParams,
        },
    };
};
