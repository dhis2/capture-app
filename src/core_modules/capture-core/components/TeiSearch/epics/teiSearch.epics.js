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
import {
    getTrackerProgramThrowIfNotFound as getTrackerProgram,
    getTrackedEntityTypeThrowIfNotFound as getTrackedEntityType,
} from '../../../metaData';
import getSearchFormId from '../getSearchFormId';

const getOuQueryArgs = (orgUnit: ?Object, orgUnitScope: string) =>
    (orgUnitScope !== 'ACCESSIBLE' ?
        { ou: orgUnit && orgUnit.id, ouMode: orgUnitScope } :
        { ouMode: orgUnitScope });

const getContextQueryArgs = (programId: ?string, trackedEntityTypeId: string) =>
    (programId ? { program: programId } : { trackedEntityType: trackedEntityTypeId });

const getPagingQueryArgs = (pageNumber: ?number) => (pageNumber ? { page: pageNumber, pageSize: 5 } : { pageSize: 5 });


const searchTei = (state: ReduxState, searchId: string, formId: string, searchGroupId: any, pageNumber?: ?number) => {
    const currentTeiSearch = state.teiSearch[searchId];
    const formValues = state.formsValues[formId];

    const {
        selectedProgramId,
        selectedTrackedEntityTypeId,
        selectedOrgUnit,
        selectedOrgUnitScope,
    } = currentTeiSearch;

    const searchGroups = getSearchGroups(selectedTrackedEntityTypeId, selectedProgramId);
    const searchGroup = searchGroups[searchGroupId];
    const filterConverter = searchGroup.unique ? convertToUniqueFilters : convertToFilters;

    const filterValues = searchGroup.searchForm.convertValues(formValues,
        (value, type, element) =>
            filterConverter(convertToServer(convertToClient(value, type), type), type, element));

    const filters = Object.keys(filterValues).reduce((accFilters, key) => {
        const value = filterValues[key];
        return isArray(value) ? [...accFilters, ...value] : [...accFilters, value];
    }, []).filter(f => f !== null && f !== undefined);

    const queryArgs = {
        filter: filters,
        ...getOuQueryArgs(selectedOrgUnit, selectedOrgUnitScope),
        ...getContextQueryArgs(selectedProgramId, selectedTrackedEntityTypeId),
        ...getPagingQueryArgs(pageNumber),

    };

    const attributes = selectedProgramId ?
        getTrackerProgram(selectedProgramId).attributes :
        getTrackedEntityType(selectedTrackedEntityTypeId).attributes;
    debugger;
    return getTrackedEntityInstances(queryArgs, attributes).then(data =>
        searchTeiResultRetrieved(
            data,
            formId,
            searchGroupId,
            searchId,
        ),
    )
        .catch((error) => {
            return searchTeiFailed(formId, searchGroupId, searchId);
        });
};

export const teiSearchChangePageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(actionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE)
        .switchMap((action) => {
            const state = store.getState();
            const { pageNumber, searchId } = action.payload;
            const currentTeiSearch = state.teiSearch[searchId];
            const searchTeiPromise = searchTei(
                state,
                searchId,
                currentTeiSearch.searchResults.formId,
                currentTeiSearch.searchResults.searchGroupId,
                pageNumber,
            );
            return fromPromise(searchTeiPromise)
                .takeUntil(action$.ofType(
                    actionTypes.REQUEST_SEARCH_TEI,
                    actionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE,
                ))
                .takeUntil(
                    action$.filter(ab =>
                        isArray(ab.payload) && ab.payload.some(a => a.type === actionTypes.INITIALIZE_TEI_SEARCH)));
        });

export const teiSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.REQUEST_SEARCH_TEI)
        .switchMap((action) => {
            const state = store.getState();
            const { formId, searchGroupId, searchId } = action.payload;
            const searchTeiPromise = searchTei(state, searchId, formId, searchGroupId);
            return fromPromise(searchTeiPromise)
                .takeUntil(action$.ofType(
                    actionTypes.REQUEST_SEARCH_TEI,
                    actionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE,
                ))
                .takeUntil(
                    action$.filter(ab =>
                        isArray(ab.payload) && ab.payload.some(a => a.type === actionTypes.INITIALIZE_TEI_SEARCH)));
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
                const program = getTrackerProgram(programId);
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

            return batchActions([
                ...addFormDataActions,
            ], batchActionTypes.RESET_SEARCH_FORMS);
        });
