// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { convertToClientConfig } from '../helpers/eventFilters';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    initEventListSuccess,
    initEventListError,
} from '../eventWorkingLists.actions';
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
        listId: string,
        lastTransaction: number,
    },
): Promise<ReduxAction<any, any>> => {
    const { commonQueryData, columnsMetaForDataFetching, categoryCombinationMeta, listId, lastTransaction } = meta;
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
                listId,
                isInit: true,
            },
        ), columnsMetaForDataFetching, categoryCombinationMeta)
        .then(data =>
            initEventListSuccess(listId, {
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
            return initEventListError(listId, i18n.t('Working list could not be loaded'));
        });
};
