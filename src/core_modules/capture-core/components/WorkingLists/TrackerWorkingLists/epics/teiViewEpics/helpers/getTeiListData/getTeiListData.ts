import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { convertToClientTeis } from './convertToClientTeis';
import {
    getSubvalues,
    getApiFilterQueryArgs,
    getMainApiFilterQueryArgs,
    getOrderQueryArgs,
} from '../getListDataCommon';
import type { RawQueryArgs } from './types';
import type { InputMeta } from './getTeiListData.types';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';

const LISTING_FIELDS =
    'trackedEntity,createdAt,inactive,attributes[attribute,value],programOwners[orgUnit,program]';

const DOWNLOAD_FIELDS = ':all,!relationships,programOwners[orgUnit,program]';

export const createApiQueryArgs = ({
    page,
    pageSize,
    programId: program,
    orgUnitId,
    filters,
    sortById,
    sortByDirection,
}: RawQueryArgs,
columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): { [key: string]: any } => {
    const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
        ? 'orgUnitMode'
        : 'ouMode';

    const orgUnitQueryParam: string = featureAvailable(FEATURES.newEntityFilterQueryParam)
        ? 'orgUnits'
        : 'orgUnit';

    return {
        ...getApiFilterQueryArgs(filters, filtersOnlyMetaForDataFetching),
        ...getMainApiFilterQueryArgs(filters, filtersOnlyMetaForDataFetching),
        order: getOrderQueryArgs({ sortById, sortByDirection, withAPINameConverter: true }),
        page,
        pageSize,
        [orgUnitQueryParam]: orgUnitId,
        [orgUnitModeQueryParam]: orgUnitId ? 'SELECTED' : 'CAPTURE',
        program,
        fields: LISTING_FIELDS,
    };
};

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
    const clientTeisWithSubvalues = await getSubvalues(querySingleResource, absoluteApiPath)(
        clientTeis,
        columnsMetaForDataFetchingArray,
    );

    return {
        recordContainers: clientTeisWithSubvalues,
        request: {
            url,
            queryParams: { ...queryParams, fields: DOWNLOAD_FIELDS },
        },
    };
};
