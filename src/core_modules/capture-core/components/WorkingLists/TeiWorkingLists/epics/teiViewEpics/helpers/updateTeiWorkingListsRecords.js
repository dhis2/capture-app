// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
import { getEventListData } from './getEventListData';
import {
    updateListSuccess,
    updateListError,
    buildFilterQueryArgs,
} from '../../../../WorkingListsCommon';
import type { Input } from './updateTeiWorkingListsRecords.types';

export const updateTeiWorkingListsRecords = ({
    page,
    pageSize,
    programId,
    programStageId,
    orgUnitId,
    sortById,
    sortByDirection,
    storeId,
    filters: filterSource,
    columnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching,
    querySingleResource,
    absoluteApiPath,
}: Input) => {
    const filters = buildFilterQueryArgs(filterSource, { columns: columnsMetaForDataFetching, filtersOnly: filtersOnlyMetaForDataFetching, storeId });
    const rawQueryArgs
    = { programId, orgUnitId, pageSize, page, filters, sortById, sortByDirection };
    const params = { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, querySingleResource, absoluteApiPath };
    const promiseToUpdateRecordsList = programStageId
        ? getEventListData({ ...rawQueryArgs, programStageId }, params)
        : getTeiListData(rawQueryArgs, params);

    return promiseToUpdateRecordsList
        .then(({ recordContainers, request }) => updateListSuccess(storeId, {
            recordContainers,
            request,
        })).catch((error) => {
            log.error(errorCreator('An error occurred when updating the working list records')({ error }));
            return updateListError(storeId, i18n.t('Working list could not be updated'));
        });
};
