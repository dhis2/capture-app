// @flow
// epics for handling search group searches
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { map, filter, takeUntil, catchError, mergeMap, mergeAll } from 'rxjs/operators';
import { race, of, from } from 'rxjs';
import { pipe as pipeD2, errorCreator } from 'capture-core-utils';
import type { InputSearchGroup, RenderFoundation } from '../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import {
    actionTypes as searchActionTypes,
    searchGroupResultCountRetrieved,
    searchGroupResultCountRetrievalFailed,
    startSearchGroupCountSearch,
    abortSearchGroupCountSearch,
    cancelSearchGroupCountSearch,
} from '../actions/searchGroup.actions';
import {
    batchActionTypes as searchBatchActionTypes,
    filteredSearchActionsForSearchBatch,
} from '../actions/searchGroup.actionBatches';
import { actionTypes as loadNewActionTypes } from '../actions/dataEntryLoadNew.actions';
import { actionTypes as loadEditActionTypes } from '../actions/dataEntry.actions';

function getServerValues(
    updatedFormValues: Object,
    foundation: RenderFoundation,
) {
    const convertFn = pipeD2(
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
    const searchGroupValues = searchGroup
        .searchFoundation
        .getElements()
        .reduce((acc, element) => {
            acc[element.id] = updatedFormValues[element.id];
            return acc;
        }, {});

    return searchGroup
        .onSearch(
            getServerValues(searchGroupValues, searchGroup.searchFoundation),
            searchContext,
        );
}

const saveWaitUids = {};

function cleanUpUidsAfterSearch(dataEntryKey: string, searchGroupId: string) {
    if (saveWaitUids[dataEntryKey] && saveWaitUids[dataEntryKey][searchGroupId]) {
        saveWaitUids[dataEntryKey][searchGroupId] = null;
    }
}

function searchHasValidAndRequiredValues(searchGroup: InputSearchGroup, values: Object, fieldsUI: Object) {
    const searchFoundation = searchGroup.searchFoundation;
    const elements = searchFoundation.getElements();
    if (
        elements
            .filter(e => fieldsUI[e.id] && fieldsUI[e.id].errorType === 'dataType' && !fieldsUI[e.id].valid)
            .length > 0
    ) {
        return false;
    }

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
        (action$: InputObservable, store: ReduxStore) =>
            action$.pipe(
                ofType(...triggerBatches),
                map((actionBatch) => {
                    const potentialSearchActions =
                        actionBatch.payload.filter(
                            action => action.type === searchActionTypes.FILTER_SEARCH_GROUP_FOR_COUNT_SEARCH,
                        );
                    if (potentialSearchActions.length === 0) {
                        return null;
                    }

                    const outputActions = potentialSearchActions
                        .map((sa) => {
                            const { dataEntryKey, searchGroup } = sa.payload;
                            const state = store.value;
                            const formValues = state.formsValues[dataEntryKey] || {};
                            const previousValues = (state.dataEntriesSearchGroupsPreviousValues[dataEntryKey] &&
                                state.dataEntriesSearchGroupsPreviousValues[dataEntryKey][searchGroup.id]) || {};
                            const fieldsUI = Object
                                .keys(state.formsSectionsFieldsUI)
                                .filter(key => key.startsWith(dataEntryKey))
                                .reduce((accFieldsUI, key) => {
                                    const sectionUI = state.formsSectionsFieldsUI[key];
                                    return {
                                        ...accFieldsUI,
                                        ...sectionUI,
                                    };
                                }, {});

                            const abortSearchGroupSearch = !searchHasValidAndRequiredValues(searchGroup, formValues, fieldsUI);
                            if (abortSearchGroupSearch) {
                                return {
                                    ...sa,
                                    abort: true,
                                };
                            }

                            const cancelSearch = !searchHasUpdatedValues(searchGroup, formValues, previousValues);
                            if (cancelSearch) {
                                return {
                                    ...sa,
                                    cancel: true,
                                };
                            }

                            return sa;
                        })
                        .map((sa) => {
                            if (sa.abort) {
                                const { dataEntryKey, searchGroup, uid } = sa.payload;
                                const currentlyActiveUids = (saveWaitUids[dataEntryKey] &&
                                    saveWaitUids[dataEntryKey][searchGroup.id]) || [];
                                cleanUpUidsAfterSearch(dataEntryKey, searchGroup.id);
                                return abortSearchGroupCountSearch(
                                    dataEntryKey, searchGroup, searchGroup.id, [...currentlyActiveUids, uid],
                                );
                            }
                            if (sa.cancel) {
                                const { dataEntryKey, uid } = sa.payload;
                                return cancelSearchGroupCountSearch(dataEntryKey, uid);
                            }

                            const { dataEntryKey, searchGroup, uid, contextProps } = sa.payload;
                            const state = store.value;
                            const values = state.formsValues[dataEntryKey];
                            return startSearchGroupCountSearch(
                                searchGroup,
                                searchGroup.id,
                                uid,
                                dataEntryKey,
                                contextProps,
                                values,
                            );
                        });
                    return outputActions;
                }),
                filter(searchActions => searchActions && searchActions.length > 0),
                map(searchActions => filteredSearchActionsForSearchBatch(searchActions)));

export const getExecuteSearchForSearchGroupEpic =
    (cancelBatches: Array<string>) =>
        (action$: InputObservable, store: ReduxStore) =>
            action$.pipe(
                ofType(searchBatchActionTypes.FILTERED_SEARCH_ACTIONS_FOR_SEARCH_BATCH),
                map((actionBatch) => {
                    const actions = actionBatch.payload;
                    return actions.filter(action => action.type === searchActionTypes.START_SEARCH_GROUP_COUNT_SEARCH);
                }),
                filter(actions => actions && actions.length > 0),
                mergeMap(searchActions => searchActions.map((searchAction) => {
                    const { dataEntryKey, contextProps, searchGroup, uid } = searchAction.payload;
                    const formValues = store.value.formsValues[dataEntryKey];
                    if (!saveWaitUids[dataEntryKey]) {
                        saveWaitUids[dataEntryKey] = {};
                    }
                    if (!saveWaitUids[dataEntryKey][searchGroup.id]) {
                        saveWaitUids[dataEntryKey][searchGroup.id] = [];
                    }
                    saveWaitUids[dataEntryKey][searchGroup.id].push(uid);

                    return race(
                        from(executeSearch(searchGroup, formValues, contextProps))
                            .pipe(
                                takeUntil(
                                    action$.pipe(
                                        ofType(searchBatchActionTypes.FILTERED_SEARCH_ACTIONS_FOR_SEARCH_BATCH),
                                        filter(ab =>
                                            ab.payload.find(a =>
                                                [
                                                    searchActionTypes.START_SEARCH_GROUP_COUNT_SEARCH,
                                                    searchActionTypes.ABORT_SEARCH_GROUP_COUNT_SEARCH,
                                                ].includes(a.type) &&
                                            a.payload.searchGroup === searchGroup)),
                                    )),
                                map((count) => {
                                    const currentlyActiveUids = saveWaitUids[dataEntryKey][searchGroup.id];
                                    cleanUpUidsAfterSearch(dataEntryKey, searchGroup.id);
                                    return searchGroupResultCountRetrieved(
                                        count, dataEntryKey, searchGroup.id, currentlyActiveUids,
                                    );
                                }),
                                catchError((error) => {
                                    log.error(errorCreator(error)({ dataEntryKey, searchGroupId: searchGroup.id }));
                                    const currentlyActiveUids = saveWaitUids[dataEntryKey][searchGroup.id];
                                    cleanUpUidsAfterSearch(dataEntryKey, searchGroup.id);
                                    return of(
                                        searchGroupResultCountRetrievalFailed(
                                            i18n.t('search group result could not be retrieved'),
                                            dataEntryKey,
                                            searchGroup.id,
                                            currentlyActiveUids,
                                        ),
                                    );
                                })),
                        action$.pipe(
                            ofType(...cancelBatches),
                            filter(ab =>
                                ab.payload.find(a =>
                                    a.type === (loadNewActionTypes.LOAD_NEW_DATA_ENTRY ||
                                        loadEditActionTypes.LOAD_EDIT_DATA_ENTRY) &&
                                    a.payload.key === dataEntryKey)),
                            map(() => {
                                saveWaitUids[dataEntryKey] = null;
                                return null;
                            })),
                    );
                })),
                mergeAll(),
                filter(action => action));
