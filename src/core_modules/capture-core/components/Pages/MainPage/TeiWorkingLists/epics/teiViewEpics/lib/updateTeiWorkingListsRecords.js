// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
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
    orgUnitId,
    sortById,
    sortByDirection,
    storeId,
    filters: filterSource,
    columnsMetaForDataFetching,
    querySingleResource,
    absoluteApiPath,
}: Input) => {
    const filters = buildFilterQueryArgs(filterSource, { columns: columnsMetaForDataFetching, storeId });

    return getTeiListData({ programId, orgUnitId, pageSize, page, filters, sortById, sortByDirection }, {
        columnsMetaForDataFetching,
        querySingleResource,
        absoluteApiPath })
        .then(({ teis, request }) => updateListSuccess(storeId, {
            recordContainers: teis,
            request,
        })).catch((error) => {
            log.error(errorCreator('An error occurred when updating the working list records')({ error }));
            return updateListError(storeId, i18n.t('Working list could not be updated'));
        });
};
