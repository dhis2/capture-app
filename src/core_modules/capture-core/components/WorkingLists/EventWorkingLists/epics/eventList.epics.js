// @flow
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    actionTypes,
    deleteEventError,
    deleteEventSuccess,
} from '../eventWorkingLists.actions';
import { workingListsCommonActionTypes } from '../../WorkingListsCommon';
import { initEventWorkingListAsync } from './initEventWorkingList';
import { updateEventWorkingListAsync } from './updateEventWorkingList';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';

export const initEventListEpic = (action$: InputObservable, _: ReduxStore, { absoluteApiPath }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { selectedTemplate, columnsMetaForDataFetching, categoryCombinationId, storeId } = action.payload;
            const { programId, orgUnitId, categories, lastTransaction, programStageId } = action.payload.context;
            const eventQueryCriteria = selectedTemplate.nextCriteria || selectedTemplate.criteria;
            const initialPromise =
                initEventWorkingListAsync(
                    eventQueryCriteria, {
                        commonQueryData: {
                            programId,
                            orgUnitId,
                            categories,
                            programStageId,
                            ouMode: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
                        },
                        columnsMetaForDataFetching,
                        categoryCombinationId,
                        storeId,
                        lastTransaction,
                    }, absoluteApiPath);
            return from(initialPromise).pipe(

                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));

export const updateEventListEpic = (action$: InputObservable, _: ReduxStore, { absoluteApiPath }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                queryArgs,
                columnsMetaForDataFetching,
                categoryCombinationId,
                storeId,
                queryArgs: { programId, orgUnitId, programStageId, categories },
            } = action.payload;
            !queryArgs?.orgUnitId && (queryArgs.ouMode = 'ACCESSIBLE');
            const updatePromise = updateEventWorkingListAsync(queryArgs, {
                commonQueryData: {
                    programId,
                    orgUnitId,
                    categories,
                    programStageId,
                    ouMode: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
                },
                columnsMetaForDataFetching,
                categoryCombinationId,
                storeId,
            }, absoluteApiPath);
            return from(updatePromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_UPDATE_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ));
        }));

// TODO: --------------------------------- REFACTOR -----------------------------------
export const requestDeleteEventEpic = (
    action$: InputObservable,
    _: ReduxStore,
    { mutate }: ApiUtils,
) =>
    action$.pipe(
        ofType(actionTypes.EVENT_REQUEST_DELETE),
        concatMap((action) => {
            const { eventId, storeId } = action.payload;
            const deletePromise = mutate({
                resource: 'tracker?async=false&importStrategy=DELETE',
                type: 'create',
                data: () => ({
                    events: [{ event: eventId }],
                }),
            })
                .then(() => deleteEventSuccess(eventId, storeId))
                .catch((error) => {
                    log.error(errorCreator('Could not delete event')({ error, eventId }));
                    return deleteEventError();
                });

            return from(deletePromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.CONTEXT_UNLOADING),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ));
        }),
    );
