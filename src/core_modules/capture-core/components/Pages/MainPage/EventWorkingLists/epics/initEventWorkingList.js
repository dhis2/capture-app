// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator, pipe } from 'capture-core-utils';
import { convertToListConfig } from './eventFiltersInterface';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    initEventListSuccess,
    initEventListError,
} from '../eventWorkingLists.actions';
import { buildQueryArgs } from './eventsQueryArgsBuilder';
import type { ApiEventQueryCriteria, CommonQueryData, ListConfig } from '../workingLists.types';

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
    const listConfig: ListConfig = await convertToListConfig(config, defaultSpecification);
    const { columnOrder, ...queryArgsPart } = listConfig;
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
                    ...listConfig,
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
