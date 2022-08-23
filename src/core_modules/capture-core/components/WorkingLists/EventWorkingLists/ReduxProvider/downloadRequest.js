// @flow
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
    const rawQueryArgs = {
        currentPage,
        rowsPerPage,
        sortById,
        sortByDirection,
        filters: buildFilterQueryArgs(filters, { columns: columnsMetaForDataFetching, storeId, isInit: true }),
        fields: 'dataValues,eventDate,event,status,orgUnit,program,programType,lastUpdated,created,assignedUser,assignedUserDisplayName,assignedUserUsername',
        programId,
        orgUnitId,
        categories,
        programStageId,
        ouMode: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
    };
    const mainColumns = getMainColumns(columnsMetaForDataFetching);
    const queryParams = createApiQueryArgs(rawQueryArgs, mainColumns, categoryCombinationId);

    return {
        url: 'events',
        queryParams,
    };
};
