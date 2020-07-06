// @flow
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { searchPageActionTypes } from '../SearchPage.container';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { actionCreator } from '../../../../actions/actions.utils';


const trackerCaptureAppUrl = () => (process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '');

export const onScopeProgramFindUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH).pipe(
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.getState();
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
                        const oldTrackerCaptureAppUrl = trackerCaptureAppUrl();
                        const urlParameters =
                          `/#/dashboard?tei=${trackedEntityInstanceId}&ou=${orgUnitId}&program=${programId}`;
                        window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                        return {};
                    }
                    // trigger action that will display modal to inform user that results are empty.
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
            );
        }),
    );


export const onScopeTrackedEntityTypeFindUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH).pipe(
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.getState();
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
                        const oldTrackerCaptureAppUrl = trackerCaptureAppUrl();
                        const urlParameters =
                          `/#/dashboard?tei=${trackedEntityInstanceId}&ou=${orgUnitId}&trackedEntityType=${trackedEntityTypeId}`;
                        window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
                        return {};
                    }
                    // trigger action that will display modal to inform user that results are empty.
                    return actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY)();
                }),
            );
        }),
    );
