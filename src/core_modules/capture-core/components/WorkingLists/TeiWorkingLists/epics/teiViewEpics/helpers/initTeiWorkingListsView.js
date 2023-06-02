// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
import { getEventListData } from './getEventListData';
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
    const { sortById, sortByDirection } = convertSortOrder(
        selectedTemplate?.criteria?.order,
        columnsMetaForDataFetching,
    );
    const customColumnOrder = getCustomColumnsConfiguration(
        selectedTemplate?.criteria?.displayColumnOrder,
        columnsMetaForDataFetching,
    );
    const pageSize = 15;
    const page = 1;
    const filters = await convertToClientFilters(
        selectedTemplate.criteria,
        columnsMetaForDataFetching,
        querySingleResource,
    );
    const apiFilters = buildFilterQueryArgs(filters, {
        columns: columnsMetaForDataFetching,
        filtersOnly: filtersOnlyMetaForDataFetching,
        storeId,
        isInit: true,
    });

    const rawQueryArgs = { programId, orgUnitId, pageSize, page, sortById, sortByDirection, filters: apiFilters };
    const params = { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, querySingleResource, absoluteApiPath };
    const programStageId = selectedTemplate?.criteria?.programStage;
    const promiseToGetRecordsList = programStageId
        ? getEventListData({ ...rawQueryArgs, programStageId }, params)
        : getTeiListData(rawQueryArgs, params);

    return promiseToGetRecordsList
        .then(({ recordContainers, request }) =>
            initListViewSuccess(storeId, {
                recordContainers,
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
                context: {
                    programStageId,
                },
            }),
        )
        .catch((error) => {
            log.error(errorCreator('An error occurred when initializing the working list view')({ error }));
            return initListViewError(storeId, i18n.t('Working list could not be loaded'));
        });
};
