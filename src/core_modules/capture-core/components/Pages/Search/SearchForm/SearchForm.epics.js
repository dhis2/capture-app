// @flow
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { searchPageActionTypes } from '../SearchPage.actions';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { actionCreator } from '../../../../actions/actions.utils';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';


const filtersForUniqueIdSearchQuery = (searchTerm) => {
    const fieldId = Object.keys(searchTerm)[0];
    return [`${fieldId}:eq:${searchTerm[fieldId]}`];
};

const searchViaUniqueIdStream = (queryArgs, attributes, scopeSearchParam) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        map(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId } } = searchResults[0];
                navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam);
                return {};
            }
            return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY_VIEW)();
        }),
        startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING_VIEW)()),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR_VIEW)())),
    );

const filtersForAttributesSearchQuery = formValues => Object.keys(formValues)
    .filter(fieldId => formValues[fieldId].replace(/\s/g, '').length)
    .map(fieldId => `${fieldId}:like:${formValues[fieldId]}`);


const searchViaAttributesStream = (queryArgs, attributes) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => {
            if (searchResults.length > 0) {
                return actionCreator(searchPageActionTypes.SEARCH_RESULTS_SUCCESS_VIEW)({ searchResults, searchResultsPaginationInfo: pagingData });
            }
            return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY_VIEW)();
        }),
        startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING_VIEW)()),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR_VIEW)())),
    );

export const searchViaUniqueIdOnScopeProgramEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH).pipe(
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.getState();
            const queryArgs = {
                filter: filtersForUniqueIdSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `program=${programId}`);
        }),
    );


export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH).pipe(
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.getState();
            const queryArgs = {
                filter: filtersForUniqueIdSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `trackedEntityType=${trackedEntityTypeId}`);
        }),
    );

export const searchViaAttributesOnScopeProgramEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH).pipe(
        flatMap(({ payload: { formId, programId, page } }) => {
            const { formsValues } = store.getState();

            const queryArgs = {
                filter: filtersForAttributesSearchQuery(formsValues[formId]),
                program: programId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH).pipe(
        flatMap(({ payload: { formId, trackedEntityTypeId, page } }) => {
            const { formsValues } = store.getState();

            const queryArgs = {
                filter: filtersForAttributesSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );


export const paginationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.PAGINATION_CHANGE).pipe(
        flatMap(({ payload: { formId, programId, newPage } }) => {
            const { formsValues } = store.getState();

            const queryArgs = {
                filter: filtersForAttributesSearchQuery(formsValues[formId]),
                program: programId,
                page: newPage,
                pageSize: 10,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );

