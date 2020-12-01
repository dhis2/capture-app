// @flow
import { getApi } from '../../../../../../../../d2/d2Instance';
import { convertToClientTeis } from './convertToClientTeis';
import { getTeisWithSubvalues } from './getTeisWithSubvalues';
import type { ApiTeiResponse, TeiColumnsMetaForDataFetchingArray, RawQueryArgs, ApiQueryArgs } from './types';

const createApiQueryArgs = ({
    page,
    pageSize,
    programId: program,
    orgUnitId: ou,
}: RawQueryArgs) => ({
    page,
    pageSize,
    ou,
    program,
});

const getTeisFromApi = (url: string, queryArgs: ApiQueryArgs): ApiTeiResponse => {
    const api = getApi();
    return api.get(url, queryArgs);
};

export const getTeiListData = async (rawQueryArgs: RawQueryArgs, columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray) => {
    const { url, queryArgs } = {
        url: 'trackedEntityInstances',
        queryArgs: createApiQueryArgs(rawQueryArgs),
    };

    const { trackedEntityInstances: apiTeis } = await getTeisFromApi(url, queryArgs);
    const clientTeis = convertToClientTeis(apiTeis, columnsMetaForDataFetching);
    const clientTeisWithSubvalues = await getTeisWithSubvalues(clientTeis, columnsMetaForDataFetching);

    return {
        teis: clientTeisWithSubvalues,
        request: {
            url,
            queryArgs,
        },
    };
};
