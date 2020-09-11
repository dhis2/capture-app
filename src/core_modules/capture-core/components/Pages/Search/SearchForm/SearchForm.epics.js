// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, ignoreElements, map, startWith, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { searchPageActionTypes } from '../SearchPage.actions';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { actionCreator } from '../../../../actions/actions.utils';
import { getApi } from '../../../../d2';

const getFiltersForUniqueIdSearchQuery = (formValues) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:eq:${formValues[fieldId]}`];
};

const searchViaUniqueIdStream = (queryArgs, attributes, scopeSearchParam) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        flatMap(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId } } = searchResults[0];
                return from(getApi().get('system/info')).pipe(
                    map(({ instanceBaseUrl }) =>
                        `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${id}&ou=${orgUnitId}&${scopeSearchParam}`),
                    tap((teiDashBoardUrl) => { window.location.href = teiDashBoardUrl; }),
                    ignoreElements(),
                );
            }
            return of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY_VIEW)());
        }),
        startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING_VIEW)()),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR_VIEW)())),
    );

const getFiltersForAttributesSearchQuery = formValues =>
    Object.keys(formValues)
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
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `program=${programId}`);
        }),
    );


export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `trackedEntityType=${trackedEntityTypeId}`);
        }),
    );

export const searchViaAttributesOnScopeProgramEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId, page } }) => {
            const { formsValues } = store.value;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
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
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId, page } }) => {
            const { formsValues } = store.value;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );
