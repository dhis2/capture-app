// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator, pipe } from 'capture-core-utils';
import { convertToClientConfig } from '../helpers/eventFilters';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    initEventListSuccess,
    initEventListError,
} from '../eventWorkingLists.actions';
import { buildQueryArgs } from '../helpers/eventsQueryArgsBuilder';
import type { ApiEventQueryCriteria, CommonQueryData, ClientConfig } from '../types';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
};

export const initEventWorkingListAsync = async (
    config: ?ApiEventQueryCriteria,
    meta: {
        commonQueryData: CommonQueryData,
        defaultSpecification: Map<string, Object>,
        listId: string,
        lastTransaction: number,
    },
): Promise<ReduxAction<any, any>> => {
    const { commonQueryData, defaultSpecification, listId, lastTransaction } = meta;
    const clientConfig: ClientConfig = await convertToClientConfig(config, defaultSpecification);
    const { columnOrder, ...queryArgsPart } = clientConfig;
    const queryArgsSource = {
        ...queryArgsPart,
        ...commonQueryData,
    };

    const mainColumnTypes = pipe(
        columns => columns.filter(column => column.isMainProperty),
        columOrderMainOnly => columOrderMainOnly.reduce((acc, column) => ({
            ...acc,
            [column.id]: column.type,
        }), {}),
    )(columnOrder);

    return getEventWorkingListDataAsync(
        buildQueryArgs(
            queryArgsSource, {
                mainPropTypes: mainColumnTypes,
                listId,
                isInit: true,
            },
        ), columnOrder)
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
