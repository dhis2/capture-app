// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    updateListSuccess,
    updateListError,
} from '../../WorkingListsCommon';
import { buildQueryArgs } from '../helpers/eventsQueryArgsBuilder';
import type { ColumnsMetaForDataFetching } from '../types';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

export const updateEventWorkingListAsync = (
    queryArgsSource: Object, {
        columnsMetaForDataFetching,
        categoryCombinationMeta,
        storeId,
    }: {
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    categoryCombinationMeta: Object,
    storeId: string,
}): Promise<ReduxAction<any, any>> => getEventWorkingListDataAsync(
    buildQueryArgs(
        queryArgsSource, {
            columnsMetaForDataFetching,
            storeId,
            isInit: false,
        }),
    columnsMetaForDataFetching, categoryCombinationMeta)
    .then(data =>
        updateListSuccess(storeId, data),
    )
    .catch((error) => {
        log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
        return updateListError(storeId, errorMessages.WORKING_LIST_UPDATE_ERROR);
    });
