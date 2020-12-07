// @flow
import { convertToClientTeis } from './convertToClientTeis';
import { getTeisWithSubvalues } from './getTeisWithSubvalues';
import type { RawQueryArgs } from './types';
import type { InputMeta } from './getTeiListData.types';

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

export const getTeiListData = async (
    rawQueryArgs: RawQueryArgs, {
        columnsMetaForDataFetching,
        singleResourceQuery,
        absoluteApiPath,
    }: InputMeta,
) => {
    const { resource, queryArgs } = {
        resource: 'trackedEntityInstances',
        queryArgs: createApiQueryArgs(rawQueryArgs),
    };

    const { trackedEntityInstances: apiTeis = [] } = await singleResourceQuery({
        resource,
        params: queryArgs,
    });
    const clientTeis = convertToClientTeis(apiTeis, columnsMetaForDataFetching);
    const clientTeisWithSubvalues = await getTeisWithSubvalues(singleResourceQuery, absoluteApiPath)(clientTeis, columnsMetaForDataFetching);

    return {
        teis: clientTeisWithSubvalues,
        request: {
            resource,
            queryArgs,
        },
    };
};
