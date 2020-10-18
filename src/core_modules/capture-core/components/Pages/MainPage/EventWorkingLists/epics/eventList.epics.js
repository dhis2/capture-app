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
import { getApi } from '../../../../../d2';

export const initEventListEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            workingListsCommonActionTypes.LIST_VIEW_INIT,
        ),
        concatMap((action) => {
            const { selectedTemplate, columnsMetaForDataFetching, categoryCombinationMeta, listId } = action.payload;
            const { programId, orgUnitId, categories, lastTransaction } = action.payload.context;
            const eventQueryCriteria = selectedTemplate.nextEventQueryCriteria || selectedTemplate.eventQueryCriteria;
            const initialPromise =
                initEventWorkingListAsync(
                    eventQueryCriteria, {
                        commonQueryData: {
                            programId,
                            orgUnitId,
                            categories,
                        },
                        columnsMetaForDataFetching,
                        categoryCombinationMeta,
                        listId,
                        lastTransaction,
                    });
            return from(initialPromise).pipe(

                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter(cancelAction => cancelAction.payload.listId === listId),
                    ),
                ),
            );
        }));

export const updateEventListEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            workingListsCommonActionTypes.LIST_UPDATE,
        ),
        concatMap((action) => {
            const { queryArgs, columnsMetaForDataFetching, categoryCombinationMeta, listId } = action.payload;
            const updatePromise = updateEventWorkingListAsync(queryArgs, { columnsMetaForDataFetching, categoryCombinationMeta, listId });
            return from(updatePromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_UPDATE_CANCEL),
                        filter(cancelAction => cancelAction.payload.listId === listId),
                    ),
                ),
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter(cancelAction => cancelAction.payload.listId === listId),
                    ),
                ));
        }));

// TODO: --------------------------------- REFACTOR -----------------------------------
export const requestDeleteEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.EVENT_REQUEST_DELETE),
        concatMap((action) => {
            const eventId = action.payload.eventId;
            const listId = 'eventList';
            const deletePromise = getApi()
                .delete(`events/${eventId}`)
                .then(() => deleteEventSuccess(eventId, listId))
                .catch((error) => {
                    log.error(errorCreator('Could not delete event')({ error, eventId }));
                    return deleteEventError();
                });

            return from(deletePromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.CONTEXT_UNLOADING),
                        filter(cancelAction => cancelAction.payload.listId === listId),
                    ),
                ));
        }),
    );
