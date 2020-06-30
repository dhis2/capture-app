// @flow
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { searchPageActionTypes } from './SearchPage.container';
import { getTrackedEntityInstances } from '../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackerProgramThrowIfNotFound as getTrackerProgram,
} from '../../../metaData';
import { actionCreator } from '../../../actions/actions.utils';

export const trackedEntitySearchUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_SEARCH).pipe(
        flatMap(({ payload: { formId, selectedProgramId } }) => {
            const { formsValues } = store.getState();
            const searchTerm = formsValues[formId];
            const fieldId = Object.keys(searchTerm)[0];
            const queryArgs = {
                filter: [`${fieldId}:eq:${searchTerm[fieldId]}`],
                program: selectedProgramId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgram(selectedProgramId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers }) => {
                    const searchResults = trackedEntityInstanceContainers;
                    if (searchResults.length > 0) {
                        const { id: trackedEntityInstanceId, tei: { orgUnit: orgUnitId } } = searchResults[0];
                        const oldTrackerCaptureAppUrl =
                          (process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '');
                        const urlParameters =
                          `/#/dashboard?tei=${trackedEntityInstanceId}&ou=${orgUnitId}&program=${selectedProgramId}`;
                        window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                        return {};
                    }
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
                startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
            );
        }),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );

export const trackedEntitySearchUsingAttributesEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(searchPageActionTypes.VIA_ATTRIBUTES_SEARCH).pipe(
        flatMap(({ payload: { formId, selectedProgramId } }) => {
            const { formsValues } = store.getState();
            const formValues = formsValues[formId];
            const searchQueryFilters = Object.keys(formValues)
                .filter(fieldId => formValues[fieldId].replace(/\s/g, '').length)
                .map(fieldId => `${fieldId}:like:${formValues[fieldId]}`);

            const queryArgs = {
                filter: searchQueryFilters,
                program: selectedProgramId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgram(selectedProgramId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers }) => {
                    const searchResults = trackedEntityInstanceContainers;
                    if (searchResults.length > 0) {
                        return actionCreator(searchPageActionTypes.SEARCH_RESULTS_SUCCESS)({ searchResults });
                    }
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
                startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
            );
        }),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );
