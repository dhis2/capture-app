// @flow
import type { TeiColumnsMetaForDataFetching, TeiWorkingListsTemplate } from '../../../types';
import type { QuerySingleResource } from '../../../../../../utils/api';
import { getCustomColumnsConfiguration } from './getCustomColumnsConfiguration';
import { convertSortOrder } from './convertSortToClient';
import { convertToClientFilters } from './convertToClientFilters';

export const convertToClientConfig = async (
    selectedTemplate: TeiWorkingListsTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
) => {
    const { sortById, sortByDirection } = convertSortOrder(
        selectedTemplate?.criteria?.order,
        columnsMetaForDataFetching,
    );
    const customColumnOrder = getCustomColumnsConfiguration(
        selectedTemplate?.criteria?.displayColumnOrder,
        columnsMetaForDataFetching,
    );
    const rowsPerPage = 15;
    const currentPage = 1;
    const filters = await convertToClientFilters(
        selectedTemplate.criteria,
        columnsMetaForDataFetching,
        querySingleResource,
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
