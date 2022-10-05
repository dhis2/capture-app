// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventListData } from './getEventListData';
import {
    updateListSuccess,
    updateListError,
    buildFilterQueryArgs,
} from '../../WorkingListsCommon';
import type { ColumnsMetaForDataFetching, CommonQueryData } from '../types';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

export const updateEventWorkingListAsync = (
    queryArgsSource: Object,
    {
        columnsMetaForDataFetching,
        categoryCombinationId,
        storeId,
        commonQueryData,
    }: {
        commonQueryData: CommonQueryData,
        columnsMetaForDataFetching: ColumnsMetaForDataFetching,
        categoryCombinationId?: ?string,
        storeId: string,
    },
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
): Promise<ReduxAction<any, any>> => {
    const rawQueryArgs = {
        ...queryArgsSource,
        fields: 'dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser',
        filters: buildFilterQueryArgs(queryArgsSource.filters, {
            columns: columnsMetaForDataFetching,
            storeId,
        }),
        ...commonQueryData,
    };

    return getEventListData({
        queryArgs: rawQueryArgs,
        columnsMetaForDataFetching,
        categoryCombinationId,
        absoluteApiPath,
        querySingleResource,
    })
        .then(({ eventContainers, pagingData, request }) =>
            updateListSuccess(storeId, {
                recordContainers: eventContainers,
                pagingData,
                request,
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return updateListError(storeId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};
