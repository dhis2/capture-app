// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { convertToListConfig } from '../eventFiltersInterface';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    initEventListSuccess,
    initEventListError,
} from '../workingLists.actions';
import { getDefaultMainConfig, getMetaDataConfig } from '../defaultColumnConfiguration';
import type { EventQueryCriteria, CommonQueryData, WorkingListConfig } from '../eventList.types';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
};

const queryDefaults = {
    page: 1,
    rowsPerPage: 15,
    sortById: 'eventDate',
    sortByDirection: 'desc',
};

function getQueryDataFromConfig(workingListConfig: ?WorkingListConfig) {
    const configOrEmptyObject = workingListConfig || {};
    const { filters = [], sortById, sortByDirection } = configOrEmptyObject;

    return {
        filters: filters
            .reduce((acc, filter) => ({
                ...acc,
                [filter.id]: filter.requestData,
            }), {}),
        sortById,
        sortByDirection,
    };
}

function addDefaultsToQueryData(queryData: Object) {
    const queryDefaultsWithOverrides = Object
        .keys(queryDefaults)
        .reduce((acc, key) => ({
            ...acc,
            [key]: ((queryData[key] || queryData[key] === false) ? queryData[key] : queryDefaults[key]),
        }), {});

    return {
        ...queryData,
        ...queryDefaultsWithOverrides,
    };
}

export const initEventWorkingListAsync = async (
    config: ?EventQueryCriteria,
    commonQueryData: CommonQueryData,
    listId: string,
): Promise<ReduxAction<any, any>> => {
    const program = getEventProgramThrowIfNotFound(commonQueryData.programId);
    const stage = program.stage;
    const workingListConfig: ?WorkingListConfig = await convertToListConfig(config, stage);

    const queryData = getQueryDataFromConfig(workingListConfig) || {};
    const queryDataWithDefaults = addDefaultsToQueryData(queryData);
    const customColumnOrder = workingListConfig && workingListConfig.columnOrder;
    const columnOrder = customColumnOrder || [
        ...getDefaultMainConfig(stage),
        ...getMetaDataConfig(stage.stageForm),
    ];

    return getEventWorkingListDataAsync({
        ...queryDataWithDefaults,
        ...commonQueryData,
    }, columnOrder)
        .then(data =>
            initEventListSuccess(listId, {
                ...data,
                config: {
                    ...workingListConfig,
                    columnOrder,
                },
                queryData: queryDataWithDefaults,
                selections: commonQueryData,
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return initEventListError(listId, i18n.t('Working list could not be loaded'));
        });
};
