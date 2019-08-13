// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { convertToEventWorkingListConfig } from '../eventFiltersInterface';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    workingListInitialDataRetrieved,
    workingListInitialRetrievalFailed,
} from '../../mainSelections.actions';
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
    const { filters = [], sortById, sortByDirection, assignedUserMode, assignedUsers } = configOrEmptyObject;

    return {
        filters: filters
            .reduce((acc, filter) => ({
                ...acc,
                [filter.id]: filter.requestData,
            }), {}),
        sortById,
        sortByDirection,
        assignedUserMode,
        assignedUsers,
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

export const initEventWorkingListAsync = (
    config: ?EventQueryCriteria,
    commonQueryData: CommonQueryData,
    listId: string,
): Promise<ReduxAction<any, any>> => {
    const program = getEventProgramThrowIfNotFound(commonQueryData.programId);
    const stage = program.stage;
    const workingListConfig: ?WorkingListConfig = convertToEventWorkingListConfig(config, stage.stageForm);

    const queryData = getQueryDataFromConfig(workingListConfig) || {};
    const queryDataWithDefaults = addDefaultsToQueryData(queryData);
    const customColumnOrder = workingListConfig && workingListConfig.columnOrder;
    const columnOrder = customColumnOrder || [
        ...getDefaultMainConfig(),
        ...getMetaDataConfig(stage.stageForm),
    ];

    return getEventWorkingListDataAsync({
        ...queryDataWithDefaults,
        ...commonQueryData,
    }, columnOrder)
        .then(data =>
            workingListInitialDataRetrieved(listId, {
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
            return workingListInitialRetrievalFailed(listId, errorMessages.WORKING_LIST_RETRIEVE_ERROR);
        });
};
