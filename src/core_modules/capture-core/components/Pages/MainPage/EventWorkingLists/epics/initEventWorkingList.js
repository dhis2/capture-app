// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { convertToClientConfig } from '../helpers/eventFilters';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    initListViewSuccess,
    initListViewError,
} from '../../WorkingListsCommon';
import { buildQueryArgs } from '../helpers/eventsQueryArgsBuilder';
import type { ApiEventQueryCriteria, CommonQueryData, ClientConfig, ColumnsMetaForDataFetching } from '../types';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
};

export const initEventWorkingListAsync = async (
    config: ?ApiEventQueryCriteria,
    meta: {
        commonQueryData: CommonQueryData,
        columnsMetaForDataFetching: ColumnsMetaForDataFetching,
        categoryCombinationMeta: ?Object,
        storeId: string,
        lastTransaction: number,
    },
): Promise<ReduxAction<any, any>> => {
    const { commonQueryData, columnsMetaForDataFetching, categoryCombinationMeta, storeId, lastTransaction } = meta;
    const clientConfig: ClientConfig = await convertToClientConfig(config, columnsMetaForDataFetching);
    const { currentPage, rowsPerPage, sortById, sortByDirection, filters } = clientConfig;
    const queryArgsSource = {
        currentPage,
        rowsPerPage,
        sortById,
        sortByDirection,
        filters,
        ...commonQueryData,
    };

    return getEventWorkingListDataAsync(
        buildQueryArgs(
            queryArgsSource, {
                columnsMetaForDataFetching,
                storeId,
                isInit: true,
            },
        ), columnsMetaForDataFetching, categoryCombinationMeta)
        .then(data =>
            initListViewSuccess(storeId, {
                ...data,
                config: {
                    ...clientConfig,
                    selections: {
                        ...commonQueryData,
                        lastTransaction,
                    },
                },
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return initListViewError(storeId, i18n.t('Working list could not be loaded'));
        });
};
