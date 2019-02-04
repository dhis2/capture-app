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
} from '../actions/searchGroup.actions';
import { actionTypes as loadNewActionTypes } from '../actions/dataEntryLoadNew.actions';
import { actionTypes as loadEditActionTypes } from '../actions/dataEntryLoadEdit.actions';

import AsyncFieldHandler from '../asyncFields/AsyncFieldHandler';
import { enrollmentBatchActionTypes, enrollmentOpenBatchActionTypes } from '../../DataEntries';


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

function cleanUpPromisesAfterSearch(dataEntryKey, searchGroupId) {
    saveWaitPromises[dataEntryKey][searchGroupId]
        .forEach((container) => {
            container.resolver();
            AsyncFieldHandler.removePromise(dataEntryKey, container.promise);
        });
    saveWaitPromises[dataEntryKey][searchGroupId] = null;
}

function searchHasRequiredValues(searchGroup, values) {
    const searchFoundation = searchGroup.searchFoundation;
    const elements = searchFoundation.getElements();
    const elementsWithValue = elements
        .filter(e => values[e.id]);
    return elementsWithValue.length >= searchGroup.minAttributesRequiredToSearch;
}

export const executeSearchForSearchGroupEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$
        .ofType(enrollmentBatchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT) // this is a temporary cheat
        .map((actionBatch) => {
            const searchActions =
                actionBatch.payload.filter(action => action.type === searchActionTypes.START_SEARCH_GROUP_COUNT_SEARCH);
            if (searchActions.length === 0) {
                return null;
            }

            const searchActionsWithValues = searchActions
                .filter((sa) => {
                    const { dataEntryKey, searchGroup } = sa.payload;
                    const formValues = store.getState().formsValues[dataEntryKey];
                    return searchHasRequiredValues(searchGroup, formValues);
                });
            return searchActionsWithValues;
        })
        .filter(searchActions => searchActions && searchActions.length > 0)
        .mergeMap(searchActions => searchActions.map((search1Action) => {
            // const search1Action = searchActions[0];
            const { dataEntryKey, contextProps, searchGroup, promiseContainer } = search1Action.payload;
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
                            .ofType(enrollmentBatchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT)
                            .filter(ab => ab.payload.find(a => a.type === searchActionTypes.START_SEARCH_GROUP_COUNT_SEARCH && a.payload.searchGroup === searchGroup)),
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
                                i18n.t('search group result could not be retrieved'), dataEntryKey, searchGroup.id));
                    }),
                action$
                    .ofType(enrollmentOpenBatchActionTypes.OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH) // this is a temporary cheat
                    .filter(ab => ab.payload.find(a => a.type === (loadNewActionTypes.LOAD_NEW_DATA_ENTRY || loadEditActionTypes.LOAD_EDIT_DATA_ENTRY) && a.payload.key === dataEntryKey))
                    .map(() => {
                        saveWaitPromises[dataEntryKey] = null;
                        return null;
                    }),
            );
        }))
        .mergeAll()
        .filter(action => action);
