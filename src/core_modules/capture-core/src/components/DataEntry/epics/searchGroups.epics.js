// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { pipe, errorCreator } from 'capture-core-utils';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { race } from 'rxjs/observable/race';
import { ActionsObservable } from 'redux-observable';
import { InputSearchGroup, RenderFoundation } from '../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import {
    actionTypes as searchActionTypes,
    searchGroupResultCountRetrieved,
    searchGroupResultCountRetrievalFailed,
    startSearchGroupCountSearch,
} from '../actions/searchGroup.actions';
import {
    batchActionTypes as searchBatchActionTypes,
    filteredSearchActionsForSearchBatch,
} from '../actions/searchGroup.actionBatches';
import { actionTypes as loadNewActionTypes } from '../actions/dataEntryLoadNew.actions';
import { actionTypes as loadEditActionTypes } from '../actions/dataEntryLoadEdit.actions';

import AsyncFieldHandler from '../asyncFields/AsyncFieldHandler';

function getServerValues(
    updatedFormValues: Object,
    foundation: RenderFoundation,
) {
    const convertFn = pipe(
        convertFormToClient,
        convertClientToServer,
    );

    const serverValues = foundation.convertValues(updatedFormValues, convertFn);
    return serverValues;
}

function executeSearch(
    searchGroup: InputSearchGroup,
    updatedFormValues: Object,
    searchContext: Object,
) {
    return searchGroup
        .onSearch(
            getServerValues(updatedFormValues, searchGroup.searchFoundation),
            searchContext,
        );
}

const saveWaitPromises = {};

function cleanUpPromisesAfterSearch(dataEntryKey: string, searchGroupId: string) {
    saveWaitPromises[dataEntryKey][searchGroupId]
        .forEach((container) => {
            container.resolver();
            AsyncFieldHandler.removePromise(dataEntryKey, container.promise);
        });
    saveWaitPromises[dataEntryKey][searchGroupId] = null;
}

function searchHasRequiredValues(searchGroup: InputSearchGroup, values: Object) {
    const searchFoundation = searchGroup.searchFoundation;
    const elements = searchFoundation.getElements();
    const elementsWithValue = elements
        .filter(e => values[e.id]);
    return elementsWithValue.length >= searchGroup.minAttributesRequiredToSearch;
}

function searchHasUpdatedValues(searchGroup: InputSearchGroup, values: Object, previousValues: Object) {
    const searchFoundation = searchGroup.searchFoundation;
    const elements = searchFoundation.getElements();
    return !!elements.find((element) => {
        const previousRawValue = previousValues[element.id];
        let previousValue = previousRawValue;
        if (!previousValue && previousValue !== false && previousValue !== 0) {
            previousValue = null;
        }
        const currentRawValue = values[element.id];
        let currentValue = currentRawValue;
        if (!currentValue && currentValue !== false && currentValue !== 0) {
            currentValue = null;
        }

        return currentValue !== previousValue;
    });
}

export const getFilterSearchGroupForSearchEpic =
    (triggerBatches: Array<string>) =>
        (action$: ActionsObservable, store: ReduxStore) =>
            action$
                .ofType(...triggerBatches)
                .map((actionBatch) => {
                    const searchActions =
                        actionBatch.payload.filter(
                            action => action.type === searchActionTypes.FILTER_SEARCH_GROUP_FOR_COUNT_SEARCH,
                        );
                    if (searchActions.length === 0) {
                        return null;
                    }

                    const filteredSearchActions = searchActions
                        .filter((sa) => {
                            const { dataEntryKey, searchGroup } = sa.payload;
                            const state = store.getState();
                            const formValues = state.formsValues[dataEntryKey] || {};
                            const previousValues = (state.dataEntriesSearchGroupsPreviousValues[dataEntryKey] &&
                                state.dataEntriesSearchGroupsPreviousValues[dataEntryKey][searchGroup.id]) || {};
                            return searchHasRequiredValues(searchGroup, formValues) &&
                                searchHasUpdatedValues(searchGroup, formValues, previousValues);
                        })
                        .map((sa) => {
                            const { dataEntryKey, searchGroup, promiseContainer, contextProps } = sa.payload;
                            const state = store.getState();
                            const values = state.formsValues[dataEntryKey];
                            return startSearchGroupCountSearch(
                                searchGroup,
                                searchGroup.id,
                                promiseContainer,
                                dataEntryKey,
                                contextProps,
                                values,
                            );
                        });
                    return filteredSearchActions;
                })
                .filter(searchActions => searchActions && searchActions.length > 0)
                .map(searchActions => filteredSearchActionsForSearchBatch(searchActions));

export const getExecuteSearchForSearchGroupEpic =
    (cancelBatches: Array<string>) =>
        (action$: ActionsObservable, store: ReduxStore) =>
            action$
                .ofType(searchBatchActionTypes.FILTERED_SEARCH_ACTIONS_FOR_SEARCH_BATCH)
                .map(actionBatch => actionBatch.payload)
                .mergeMap(searchActions => searchActions.map((searchAction) => {
                    const { dataEntryKey, contextProps, searchGroup, promiseContainer } = searchAction.payload;
                    const formValues = store.getState().formsValues[dataEntryKey];
                    if (!saveWaitPromises[dataEntryKey]) {
                        saveWaitPromises[dataEntryKey] = {};
                    }
                    if (!saveWaitPromises[dataEntryKey][searchGroup.id]) {
                        saveWaitPromises[dataEntryKey][searchGroup.id] = [];
                    }
                    saveWaitPromises[dataEntryKey][searchGroup.id].push(promiseContainer);

                    return race(
                        fromPromise(executeSearch(searchGroup, formValues, contextProps))
                            .takeUntil(
                                action$
                                    .ofType(searchBatchActionTypes.FILTERED_SEARCH_ACTIONS_FOR_SEARCH_BATCH)
                                    .filter(ab =>
                                        ab.payload.find(a =>
                                            a.type === searchActionTypes.START_SEARCH_GROUP_COUNT_SEARCH &&
                                            a.payload.searchGroup === searchGroup)),
                            )
                            .map((count) => {
                                cleanUpPromisesAfterSearch(dataEntryKey, searchGroup.id);
                                return searchGroupResultCountRetrieved(count, dataEntryKey, searchGroup.id);
                            })
                            .catch((error) => {
                                log.error(errorCreator(error)({ dataEntryKey, searchGroupId: searchGroup.id }));
                                cleanUpPromisesAfterSearch(dataEntryKey, searchGroup.id);
                                return of(
                                    searchGroupResultCountRetrievalFailed(
                                        i18n.t('search group result could not be retrieved'),
                                        dataEntryKey,
                                        searchGroup.id,
                                    ),
                                );
                            }),
                        action$
                            .ofType(...cancelBatches)
                            .filter(ab =>
                                ab.payload.find(a =>
                                    a.type === (loadNewActionTypes.LOAD_NEW_DATA_ENTRY ||
                                        loadEditActionTypes.LOAD_EDIT_DATA_ENTRY) &&
                                    a.payload.key === dataEntryKey))
                            .map(() => {
                                saveWaitPromises[dataEntryKey] = null;
                                return null;
                            }),
                    );
                }))
                .mergeAll()
                .filter(action => action);
