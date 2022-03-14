// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
import {
    initListViewSuccess,
    initListViewError,
    buildFilterQueryArgs,
} from '../../../../WorkingListsCommon';
import type { Input } from './initTeiWorkingListsView.types';
import { convertToClientFilters, convertSortOrder, getCustomColumnsConfiguration } from '../../../helpers/TEIFilters';

export const initTeiWorkingListsViewAsync = async ({
    programId,
    orgUnitId,
    storeId,
    selectedTemplate,
    columnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching,
    querySingleResource,
    absoluteApiPath,
}: Input) => {
    const { sortById, sortByDirection } = convertSortOrder(selectedTemplate?.criteria?.order);
    const customColumnOrder = getCustomColumnsConfiguration(selectedTemplate?.criteria?.displayColumnOrder, columnsMetaForDataFetching);
    const pageSize = 15;
    const page = 1;
    const filters = await convertToClientFilters(selectedTemplate.criteria, columnsMetaForDataFetching, querySingleResource);
    const apiFilters = buildFilterQueryArgs(filters, { columns: columnsMetaForDataFetching, filtersOnly: filtersOnlyMetaForDataFetching, storeId, isInit: true });
    return getTeiListData({ programId, orgUnitId, pageSize, page, sortById, sortByDirection, filters: apiFilters }, {
        columnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching,
        querySingleResource,
        absoluteApiPath })
        .then(({ teis, request }) =>
            initListViewSuccess(storeId, {
                recordContainers: teis,
                pagingData: {
                    rowsPerPage: pageSize,
                    currentPage: page,
                },
                request,
                config: {
                    sortById,
                    sortByDirection,
                    filters,
                    selections: {
                        programId,
                        orgUnitId,
                    },
                    customColumnOrder,
                },
            }),
        ).catch((error) => {
            log.error(errorCreator('An error occurred when initializing the working list view')({ error }));
            return initListViewError(storeId, i18n.t('Working list could not be loaded'));
        });
};
