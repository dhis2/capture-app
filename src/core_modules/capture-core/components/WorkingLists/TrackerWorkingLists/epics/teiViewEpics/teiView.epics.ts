import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import type { ReduxStore, ApiUtils, EpicAction } from 'capture-core-utils/types';
import { workingListsCommonActionTypes } from '../../../WorkingListsCommon';
import { TRACKER_WORKING_LISTS_TYPE } from '../../constants';
import { initTrackerWorkingListsViewAsync, updateTrackerWorkingListsRecords } from './helpers';

export const initTeiViewEpic = (
    action$: EpicAction<any>,
    store: ReduxStore, {
        querySingleResource,
        absoluteApiPath,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT),
        filter(({ payload: { workingListsType } }) => workingListsType === TRACKER_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { storeId, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, selectedTemplate } = action.payload;
            const { programId, orgUnitId } = action.payload.context;
            return from(initTrackerWorkingListsViewAsync({
                programId,
                orgUnitId,
                storeId,
                selectedTemplate,
                columnsMetaForDataFetching,
                filtersOnlyMetaForDataFetching,
                querySingleResource,
                absoluteApiPath,
            })).pipe(takeUntil(action$.pipe(
                ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                filter(cancelAction => cancelAction.payload.storeId === storeId),
            )));
        }));
export const updateTeiListEpic = (
    action$: EpicAction<any>,
    store: ReduxStore, {
        querySingleResource,
        absoluteApiPath,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === TRACKER_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { storeId, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, queryArgs } = action.payload;

            const {
                currentPage: page,
                rowsPerPage: pageSize,
                programId,
                programStageId,
                orgUnitId,
                filters,
                sortById,
                sortByDirection,
            } = queryArgs;

            return from(updateTrackerWorkingListsRecords({
                page,
                pageSize,
                programId,
                programStageId,
                orgUnitId,
                filters,
                sortById,
                sortByDirection,
                storeId,
                columnsMetaForDataFetching,
                filtersOnlyMetaForDataFetching,
                querySingleResource,
                absoluteApiPath,
            })).pipe(takeUntil(action$.pipe(
                ofType(workingListsCommonActionTypes.LIST_UPDATE_CANCEL),
                filter(cancelAction => cancelAction.payload.storeId === storeId),
            )));
        }));

