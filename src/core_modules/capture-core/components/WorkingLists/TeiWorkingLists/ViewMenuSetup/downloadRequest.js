// @flow
import { buildFilterQueryArgs } from '../../WorkingListsCommon';
import { createApiTrackedEntitiesQueryArgs } from '../epics/';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../types';

export const computeDownloadRequest = ({
    clientConfig: { currentPage: page, rowsPerPage: pageSize, sortById, sortByDirection, filters },
    context: { programId, orgUnitId, storeId },
    meta: { columnsMetaForDataFetching },
    filtersOnlyMetaForDataFetching,
}: {
    clientConfig: {
        currentPage: number,
        rowsPerPage: number,
        sortById: string,
        sortByDirection: string,
        filters: Object,
    },
    context: {
        programId: string,
        orgUnitId: string,
        storeId: string,
    },
    meta: { columnsMetaForDataFetching: TeiColumnsMetaForDataFetching },
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
}) => {
    const apiFilters = buildFilterQueryArgs(filters, {
        columns: columnsMetaForDataFetching,
        filtersOnly: filtersOnlyMetaForDataFetching,
        storeId,
        isInit: true,
    });

    const rawQueryArgs = { programId, orgUnitId, pageSize, page, sortById, sortByDirection, filters: apiFilters };
    const queryParams = createApiTrackedEntitiesQueryArgs(
        rawQueryArgs,
        columnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching,
    );

    return {
        url: 'tracker/trackedEntities',
        queryParams,
    };
};
