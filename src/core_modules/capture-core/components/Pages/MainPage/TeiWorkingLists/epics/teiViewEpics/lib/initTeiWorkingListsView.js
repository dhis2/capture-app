// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
import {
    initListViewSuccess,
    initListViewError,
} from '../../../../WorkingListsCommon';
import type { Input } from './initTeiWorkingListsView.types';

const getSortByConfig = (columnsMetaForDataFetching) => {
    let column = columnsMetaForDataFetching.find(col => col.visible);
    if (!column) {
        column = columnsMetaForDataFetching[0];
    }

    return {
        sortById: column.id,
        sortByDirection: 'desc',
    };
};

export const initTeiWorkingListsView = ({
    programId,
    orgUnitId,
    storeId,
    columnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching,
    singleResourceQuery,
    absoluteApiPath,
}: Input) => {
    const { sortById, sortByDirection } = getSortByConfig([...columnsMetaForDataFetching.values()]);
    const pageSize = 15;
    const page = 1;

    return getTeiListData({ programId, orgUnitId, pageSize, page, sortById, sortByDirection }, {
        columnsMetaForDataFetching,
        filtersOnlyMetaForDataFetching,
        singleResourceQuery,
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
