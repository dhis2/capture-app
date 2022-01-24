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

const getClientFilters = (criteria = {}) => {
    const { programStatus, enrollmentDate } = criteria;
    let filters = {};

    if (programStatus) {
        filters = { ...filters,
            programStatus: {
                usingOptionSet: true,
                values: [programStatus],
            },
        };
    }
    if (enrollmentDate) {
        filters = { ...filters, enrollmentDate };
    }
    // TODO blocked by https://jira.dhis2.org/browse/DHIS2-12376. Need to know the shape of trackedEntityInstanceFilters and add it to the query.
    return filters;
};

export const initTeiWorkingListsView = ({
    programId,
    orgUnitId,
    storeId,
    selectedTemplate,
    columnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching,
    querySingleResource,
    absoluteApiPath,
}: Input) => {
    const sortById = 'regDate';
    const sortByDirection = 'desc';
    const pageSize = 15;
    const page = 1;
    const filters = getClientFilters(selectedTemplate.criteria);
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
                },
            }),
        ).catch((error) => {
            log.error(errorCreator('An error occurred when initializing the working list view')({ error }));
            return initListViewError(storeId, i18n.t('Working list could not be loaded'));
        });
};
