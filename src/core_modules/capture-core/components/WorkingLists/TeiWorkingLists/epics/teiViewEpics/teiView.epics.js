// @flow
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import { workingListsCommonActionTypes } from '../../../WorkingListsCommon';
import { TEI_WORKING_LISTS_TYPE } from '../../constants';
import { initTeiWorkingListsViewAsync, updateTeiWorkingListsRecords } from './helpers';

export const initTeiViewEpic = (
    action$: InputObservable,
    store: ReduxStore, {
        querySingleResource,
        absoluteApiPath,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { storeId, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, selectedTemplate } = action.payload;
            const { programId, orgUnitId } = action.payload.context;
            return from(initTeiWorkingListsViewAsync({
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
    action$: InputObservable,
    store: ReduxStore, {
        querySingleResource,
        absoluteApiPath,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
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

            return from(updateTeiWorkingListsRecords({
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

