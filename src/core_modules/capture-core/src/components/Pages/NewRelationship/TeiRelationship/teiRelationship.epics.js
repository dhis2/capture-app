// @flow

import { batchActions } from 'redux-batched-actions';
import {
    batchActionTypes,
    actionTypes,
} from './teiRelationship.actions';

import {
    selectFindMode,
} from '../newRelationship.actions';

import {
    initializeTeiSearch,
} from '../../../TeiSearch/actions/teiSearch.actions';

import {
    addFormData,
} from '../../../D2Form/actions/form.actions';

import {
    getSearchGroupsByProgram,
    getSearchGroupsByTrackedEntityType,
} from '../../../TeiSearch/getSearchGroups';

const searchId = 'relationshipTeiSearch';

export const openRelationshipTeiSearchEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.OPEN_TEI_SEARCH)
        .map((action) => {
            const { programId, trackedEntityTypeId } = action.payload;

            const searchGroups = programId ?
                getSearchGroupsByProgram(programId) :
                getSearchGroupsByTrackedEntityType(trackedEntityTypeId);

            const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                const key = `${searchId}-${i}`;
                return addFormData(key, {});
            }) : [];

            return batchActions([
                ...addFormDataActions,
                initializeTeiSearch(searchId),
                selectFindMode('TEI_SEARCH'),
            ], batchActionTypes.BATCH_OPEN_TEI_SEARCH);
        });
