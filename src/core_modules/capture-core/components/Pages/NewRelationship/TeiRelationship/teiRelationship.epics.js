// @flow

import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import {
    batchActionTypes,
} from './teiRelationship.actions';

import {
    actionTypes as newRelationshipActionTypes,
    setSearching,
    unsetSearching,
} from '../newRelationship.actions';

import {
    actionTypes as teiSearchActionTypes,
    initializeTeiSearch,
} from '../../../TeiSearch/actions/teiSearch.actions';

import { getSearchFormId } from '../../../TeiSearch/getSearchFormId';

import {
    addFormData,
} from '../../../D2Form/actions/form.actions';

import { getSearchGroups } from '../../../TeiSearch/getSearchGroups';

const searchId = 'relationshipTeiSearch';

export const openRelationshipTeiSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newRelationshipActionTypes.SELECT_FIND_MODE),
        filter(action => action.payload.findMode && action.payload.findMode === 'TEI_SEARCH'),
        map(() => {
            const state = store.value;
            const selectedRelationshipType = state.newRelationship.selectedRelationshipType;

            const { programId, trackedEntityTypeId } = selectedRelationshipType.to;
            const contextId = programId || trackedEntityTypeId;

            const searchGroups = getSearchGroups(trackedEntityTypeId, programId);


            const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                const key = getSearchFormId(searchId, contextId, i.toString());
                return addFormData(key, {});
            }) : [];

            return batchActions([
                ...addFormDataActions,
                initializeTeiSearch(searchId, programId, trackedEntityTypeId),
            ], batchActionTypes.BATCH_OPEN_TEI_SEARCH);
        }));

export const requestRelationshipTeiSearchEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(teiSearchActionTypes.REQUEST_SEARCH_TEI),
        filter(action => action.payload.searchId && action.payload.searchId === searchId),
        map(() => setSearching()));

export const TeiRelationshipNewOrEditSearchEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            teiSearchActionTypes.TEI_NEW_SEARCH,
            teiSearchActionTypes.TEI_EDIT_SEARCH,
        ),
        filter(action => action.payload.searchId && action.payload.searchId === searchId),
        map(() => unsetSearching()));
