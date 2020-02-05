// @flow
import { batchActions } from 'redux-batched-actions';
import { ActionsObservable } from 'redux-observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';

import {
    actionTypes,
    batchActionTypes,
    fetchTemplatesSuccess,
    fetchTemplatesError,
    selectTemplate,
} from '../workingLists.actions';
import { getTemplatesAsync } from './templatesFetcher';

/*
import {
    actionTypes as mainSelectionActionTypes,
} from '../../mainSelections.actions';
import { actionTypes as viewEventActionTypes } from '../../../ViewEvent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../../NewEvent';
import {
    batchActionTypes as eventsListBatchActionTypes,
    setCurrentWorkingListConfig,
    workingListConfigsRetrieved,
} from '../eventsList.actions';
import { getProgramFromProgramIdThrowIfNotFound, EventProgram } from '../../../../../metaData';
import { workingListsActions } from '../../../MainPage/WorkingLists';
*/


export const retrieveTemplatesEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        /*mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
        viewEventActionTypes.INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE,
        newEventDataEntryActionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS,*/
        actionTypes.TEMPLATES_FETCH,
    )
        .switchMap((action) => {
            const listId = action.payload.listId;
            const promise = getTemplatesAsync(store.getState())
                .then(container => batchActions([
                    selectTemplate(container.default.id, listId, container.default),
                    fetchTemplatesSuccess(container.workingListConfigs, listId),
                ], batchActionTypes.TEMPLATES_FETCH_SUCCESS_BATCH))
                .catch((error) => {
                    log.error(
                        errorCreator(error)({ epic: 'retrieveTemplatesEpic' }),
                    );
                    return fetchTemplatesError(i18n.t('an error occurred loading working lists'), listId);
                });

            return fromPromise(promise)
                .takeUntil(
                    action$.ofType(actionTypes.TEMPLATES_FETCH_CANCEL)
                        .filter(cancelAction => cancelAction.payload.listId === listId),
                );
        });

/*
export const addWorkingListConfigEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        eventListActionTypes.ADD_WORKING_LIST_CONFIG,
    )
        .switchMap((action) => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const selectedListId = state.workingListConfigSelector.eventMainPage.currentListId;
            const filtersByKey = state.workingListFiltersEdit[selectedListId];
            const { name, description } = action.payload;
            const workingListConfigData = {
                name,
                description,
                filtersByKey,
                programId,
            };

            const promise = addEventProgramWorkingListConfig(workingListConfigData).then((result) => {
                const s = 1;
            });
            return fromPromise(promise);
        });
*/
