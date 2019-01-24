// @flow
import isArray from 'd2-utilizr/src/isArray';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { batchActions } from 'redux-batched-actions';
import { convertValue as convertToClient } from '../../../converters/formToClient';
import { convertValue as convertToServer } from '../../../converters/clientToServer';
import {
    convertValue as convertToFilters,
    convertValueToEqual as convertToUniqueFilters,
} from '../serverToFilters';
import {
    actionTypes,
    batchActionTypes,
    searchTeiResultRetrieved,
    searchTeiFailed,
    setProgramAndTrackedEntityType,
} from '../actions/teiSearch.actions';
import {
    actionTypes as programSelectorActionTypes,
} from '../SearchProgramSelector/searchProgramSelector.actions';
import getSearchGroups from '../getSearchGroups';
import { getTrackedEntityInstances } from '../../../trackedEntityInstances/trackedEntityInstanceRequests';

import {
    addFormData,
} from '../../D2Form/actions/form.actions';
import { programCollection } from '../../../metaDataMemoryStores';
import errorCreator from '../../../utils/errorCreator';
import getSearchFormId from '../getSearchFormId';


export const teiSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.REQUEST_SEARCH_TEI)
        .switchMap((action) => {
            const state = store.getState();

            const { formId, searchGroupId, searchId } = action.payload;
            const { selectedProgramId, selectedTrackedEntityTypeId, selectedOrgUnit, selectedOrgUnitScope } = state.teiSearch[searchId];
            const formValues = state.formsValues[formId];
            const searchGroups = getSearchGroups(selectedTrackedEntityTypeId, selectedProgramId);

            const searchGroup = searchGroups[searchGroupId];

            const filterConverter = searchGroup.unique ? convertToUniqueFilters : convertToFilters;

            const filterValues = searchGroup.searchForm.convertValues(formValues,
                (type, value, element) =>
                    filterConverter(type, convertToServer(type, convertToClient(type, value)), element));

            const filters = Object.keys(filterValues).reduce((accFilters, key) => {
                const value = filterValues[key];
                return isArray(value) ? [...accFilters, ...value] : [...accFilters, value];
            }, []);

            let queryArgs = {
                filter: filters,
                ouMode: selectedOrgUnitScope,
            };
            if (selectedOrgUnit && selectedOrgUnitScope !== 'ACCESSIBLE') {
                queryArgs = { ...queryArgs, ou: selectedOrgUnit.id };
            }
            if (selectedProgramId) {
                queryArgs = { ...queryArgs, program: selectedProgramId };
            } else {
                queryArgs = { ...queryArgs, trackedEntityType: selectedTrackedEntityTypeId };
            }

            const program = programCollection.get(selectedProgramId);

            return fromPromise(getTrackedEntityInstances(queryArgs, program.attributes).then(data =>
                searchTeiResultRetrieved(
                    data,
                    formId,
                    searchGroupId,
                    searchId,
                ),
            )
                .catch(error => searchTeiFailed(formId, searchGroupId, searchId)));
        });

export const teiSearchSetProgramEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(programSelectorActionTypes.TEI_SEARCH_START_SET_PROGRAM)
        .map((action) => {
            const state = store.getState();
            const searchId = action.payload.searchId;
            const programId = action.payload.programId;
            let trackedEntityTypeId = state.teiSearch[searchId].selectedTrackedEntityTypeId;
            const contextId = programId || trackedEntityTypeId;
            if (programId) {
                const program = programCollection.get(programId);
                // $FlowFixMe
                trackedEntityTypeId = program.trackedEntityType.id;
            }
            let searchGroups = [];
            if (trackedEntityTypeId) {
                searchGroups = getSearchGroups(trackedEntityTypeId, programId);
            }

            const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                const key = getSearchFormId(searchId, contextId, i.toString());
                return addFormData(key, {});
            }) : [];

            return batchActions([
                ...addFormDataActions,
                setProgramAndTrackedEntityType(searchId, programId, trackedEntityTypeId),
            ], batchActionTypes.BATCH_SET_TEI_SEARCH_PROGRAM_AND_TET);
        });

export const teiNewSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.TEI_NEW_SEARCH)
        .map((action) => {
            const state = store.getState();
            const searchId = action.payload.searchId;
            const currentTeiSearch = state.teiSearch[searchId];

            const contextId = currentTeiSearch.selectedProgramId || currentTeiSearch.selectedTrackedEntityTypeId;

            const searchGroups = getSearchGroups(currentTeiSearch.selectedTrackedEntityTypeId, currentTeiSearch.selectedProgramId);

            const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                const key = getSearchFormId(searchId, contextId, i.toString());
                return addFormData(key, {});
            }) : [];

            return batchActions(addFormDataActions, batchActionTypes.RESET_SEARCH_FORMS);
        });
