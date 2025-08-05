import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import log from 'loglevel';
import { errorCreator, featureAvailable, FEATURES } from 'capture-core-utils';
import type { EpicAction, ReduxStore, ApiUtils } from '../../../../../capture-core-utils/types/global';
import {
    actionTypes,
    deleteEventError,
    deleteEventSuccess,
} from '../eventWorkingLists.actions';
import { workingListsCommonActionTypes } from '../../WorkingListsCommon';
import { initEventWorkingListAsync } from './initEventWorkingList';
import { updateEventWorkingListAsync } from './updateEventWorkingList';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';

export const initEventListEpic = (
    action$: EpicAction<any>,
    _: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const { selectedTemplate, columnsMetaForDataFetching, categoryCombinationId, storeId } = action.payload;
            const {
                programId,
                orgUnitId,
                categories,
                lastTransaction,
                programStageId,
                lockedFilters,
            } = action.payload.context;

            const eventQueryCriteria = {
                ...(selectedTemplate.nextCriteria || selectedTemplate.criteria),
                ...lockedFilters,
            };
            const orgUnitModeQueryParam = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const initialPromise =
                initEventWorkingListAsync(
                    eventQueryCriteria, {
                        commonQueryData: {
                            programId,
                            orgUnitId,
                            categories,
                            programStageId,
                            [orgUnitModeQueryParam]: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
                        },
                        columnsMetaForDataFetching,
                        categoryCombinationId,
                        storeId,
                        lastTransaction,
                    },
                    absoluteApiPath,
                    querySingleResource);
            return from(initialPromise).pipe(

                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter((cancelAction: any) => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));

export const updateEventListEpic = (
    action$: EpicAction<any>,
    _: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.LIST_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const orgUnitModeQueryParam = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const {
                queryArgs,
                columnsMetaForDataFetching,
                categoryCombinationId,
                storeId,
                queryArgs: { programId, orgUnitId, programStageId, categories },
            } = action.payload;
            !queryArgs?.orgUnitId && (queryArgs[orgUnitModeQueryParam] = 'ACCESSIBLE');
            const updatePromise = updateEventWorkingListAsync(queryArgs, {
                commonQueryData: {
                    programId,
                    orgUnitId,
                    categories,
                    programStageId,
                    [orgUnitModeQueryParam]: orgUnitId ? 'SELECTED' : 'ACCESSIBLE',
                },
                columnsMetaForDataFetching,
                categoryCombinationId,
                storeId,
            },
            absoluteApiPath,
            querySingleResource);

            return from(updatePromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_UPDATE_CANCEL),
                        filter((cancelAction: any) => cancelAction.payload.storeId === storeId),
                    ),
                ),
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL),
                        filter((cancelAction: any) => cancelAction.payload.storeId === storeId),
                    ),
                ));
        }));

export const requestDeleteEventEpic = (
    action$: EpicAction<any>,
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
                        filter((cancelAction: any) => cancelAction.payload.storeId === storeId),
                    ),
                ));
        }),
    );
