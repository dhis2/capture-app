// @flow
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import { workingListsCommonActionTypes } from '../../../WorkingListsCommon';
import { TEI_WORKING_LISTS_TYPE } from '../../constants';
import { initTeiWorkingListsView } from './lib';

export const initTeiViewEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { storeId, columnsMetaForDataFetching } = action.payload;
            const { programId, orgUnitId } = action.payload.context;
            return from(initTeiWorkingListsView({
                programId,
                orgUnitId,
                storeId,
                columnsMetaForDataFetching,
            })).pipe(

                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));
