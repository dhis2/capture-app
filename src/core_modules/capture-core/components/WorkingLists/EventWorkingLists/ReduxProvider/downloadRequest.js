// @flow
import { featureAvailable, FEATURES } from 'capture-core-utils';
import type { Program } from '../../../../metaData';
import { buildFilterQueryArgs } from '../../WorkingListsCommon';
import { createApiQueryArgs, getMainColumns } from '../epics/getEventListData';
import type { ColumnsMetaForDataFetching } from '../types';

export const computeDownloadRequest = ({
    clientConfig: { currentPage, rowsPerPage, sortById, sortByDirection, filters },
    context: { programId, categories, programStageId, orgUnitId, storeId, program },
    meta: { columnsMetaForDataFetching },
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
        categories: Object,
        programStageId: string,
        orgUnitId: string,
        storeId: string,
        program: Program,
    },
    meta: { columnsMetaForDataFetching: ColumnsMetaForDataFetching },
}) => {
    const categoryCombinationId = program.categoryCombination && program.categoryCombination.id;
    const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
        ? 'orgUnitMode'
        : 'ouMode';
    const rawQueryArgs = {
        currentPage,
        rowsPerPage,
        sortById,
        sortByDirection,
        filters: buildFilterQueryArgs(filters, { columns: columnsMetaForDataFetching, storeId, isInit: true }),
        fields: 'dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser,',
        programId,
        orgUnitId,
        categories,
        programStageId,
        [orgUnitModeQueryParam]: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
    };
    const mainColumns = getMainColumns(columnsMetaForDataFetching);
    const queryParams = createApiQueryArgs(rawQueryArgs, mainColumns, categoryCombinationId);

    return {
        url: 'tracker/events',
        queryParams,
    };
};
