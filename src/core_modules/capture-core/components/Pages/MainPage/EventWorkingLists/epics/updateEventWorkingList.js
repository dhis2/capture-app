// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    updateEventListSuccess,
    updateEventListError,
} from '../eventWorkingLists.actions';
import { buildQueryArgs } from '../helpers/eventsQueryArgsBuilder';
import type { ColumnsMetaForDataFetching } from '../types';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

export const updateEventWorkingListAsync = (
    queryArgsSource: Object, {
        columnsMetaForDataFetching,
        categoryCombinationMeta,
        listId,
    }: {
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    categoryCombinationMeta: Object,
    listId: string,
}): Promise<ReduxAction<any, any>> => getEventWorkingListDataAsync(
    buildQueryArgs(
        queryArgsSource, {
            columnsMetaForDataFetching,
            listId,
            isInit: false,
        }),
    columnsMetaForDataFetching, categoryCombinationMeta)
    .then(data =>
        updateEventListSuccess(listId, data),
    )
    .catch((error) => {
        log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
        return updateEventListError(listId, errorMessages.WORKING_LIST_UPDATE_ERROR);
    });
