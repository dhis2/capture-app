// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { searchPageActionTypes } from '../SearchPage.container';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { actionCreator } from '../../../../actions/actions.utils';
import { getApi } from '../../../../d2';

const trackerCaptureAppUrl = instanceBaseUrl => `${instanceBaseUrl}/dhis-web-tracker-capture`;

export const onScopeProgramFindUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.value;
            const searchTerm = formsValues[formId];
            const fieldId = Object.keys(searchTerm)[0];
            const queryArgs = {
                filter: [`${fieldId}:eq:${searchTerm[fieldId]}`],
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers }) => {
                    const searchResults = trackedEntityInstanceContainers;
                    if (searchResults.length > 0) {
                        const { id: trackedEntityInstanceId, tei: { orgUnit: orgUnitId } } = searchResults[0];
                        getApi().get('system/info')
                            .then(({ instanceBaseUrl }) => {
                                const oldTrackerCaptureAppUrl = trackerCaptureAppUrl(instanceBaseUrl);
                                const urlParameters = `/#/dashboard?tei=${trackedEntityInstanceId}&ou=${orgUnitId}&program=${programId}`;
                                window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                            });
                        return {};
                    }
                    // trigger action that will display modal to inform user that results are empty.
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
                startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
            );
        }),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );


export const onScopeTrackedEntityTypeFindUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.value;
            const searchTerm = formsValues[formId];
            const fieldId = Object.keys(searchTerm)[0];
            const queryArgs = {
                filter: [`${fieldId}:eq:${searchTerm[fieldId]}`],
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers }) => {
                    const searchResults = trackedEntityInstanceContainers;
                    if (searchResults.length > 0) {
                        const { id: trackedEntityInstanceId, tei: { orgUnit: orgUnitId } } = searchResults[0];
                        getApi().get('system/info')
                            .then(({ instanceBaseUrl }) => {
                                const oldTrackerCaptureAppUrl = trackerCaptureAppUrl(instanceBaseUrl);
                                const urlParameters = `/#/dashboard?tei=${trackedEntityInstanceId}&ou=${orgUnitId}&trackedEntityType=${trackedEntityTypeId}`;
                                window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                            });
                        return {};
                    }
                    // trigger action that will display modal to inform user that results are empty.
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
                startWith(actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING)()),
            );
        }),
        catchError(() => of(actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR)())),
    );
