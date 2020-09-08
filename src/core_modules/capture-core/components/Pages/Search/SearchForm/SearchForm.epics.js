// @flow
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { searchPageActionTypes } from '../SearchPage.container';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { actionCreator } from '../../../../actions/actions.utils';

const trackerCaptureAppUrl = () => (process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '');

const getFiltersForUniqueIdSearchQuery = (formValues) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:eq:${formValues[fieldId]}`];
};

const searchViaUniqueIdStream = (queryArgs, attributes, scopeSearchParam) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        map(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId } } = searchResults[0];
                const oldTrackerCaptureAppUrl = trackerCaptureAppUrl();
                const urlParameters = `/#/dashboard?tei=${id}&ou=${orgUnitId}&${scopeSearchParam}`;
                window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                return {};
            }
            return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
        }),
        startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );

const getFiltersForAttributesSearchQuery = formValues =>
    Object.keys(formValues)
        .filter(fieldId => formValues[fieldId].replace(/\s/g, '').length)
        .map(fieldId => `${fieldId}:like:${formValues[fieldId]}`);


const searchViaAttributesStream = (queryArgs, attributes) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        map(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                return actionCreator(searchPageActionTypes.SEARCH_RESULTS_SUCCESS)({ searchResults });
            }
            return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
        }),
        startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );

export const searchViaUniqueIdOnScopeProgramEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH).pipe(
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.getState();
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
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH).pipe(
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.getState();
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
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH).pipe(
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.getState();

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH).pipe(
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.getState();

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaAttributesStream(queryArgs, attributes);
        }),
    );
