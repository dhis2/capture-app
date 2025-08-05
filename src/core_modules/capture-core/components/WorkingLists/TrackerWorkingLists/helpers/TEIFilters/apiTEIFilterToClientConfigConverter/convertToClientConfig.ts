import type { TeiColumnsMetaForDataFetching, TrackerWorkingListsTemplate } from '../../../types';
import type { QuerySingleResource } from '../../../../../../utils/api';
import { getCustomColumnsConfiguration } from './getCustomColumnsConfiguration';
import { convertSortOrder } from './convertSortToClient';
import { convertToClientFilters } from './convertToClientFilters';

export const convertToClientConfig = async (
    selectedTemplate: TrackerWorkingListsTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
) => {
    const { sortById, sortByDirection } = convertSortOrder(
        selectedTemplate?.criteria?.order,
        columnsMetaForDataFetching,
    );
    const customColumnOrder = getCustomColumnsConfiguration(
        columnsMetaForDataFetching,
        selectedTemplate?.criteria?.displayColumnOrder,
    );
    const rowsPerPage = 15;
    const currentPage = 1;
    const filters = await convertToClientFilters(
        columnsMetaForDataFetching,
        querySingleResource,
        selectedTemplate.criteria,
    );
    return {
        filters,
        customColumnOrder,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
    };
};
