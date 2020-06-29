// @flow
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { searchPageActionTypes } from './SearchPage.container';
import { getTrackedEntityInstances } from '../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackerProgramThrowIfNotFound as getTrackerProgram,
} from '../../../metaData';

export const trackedEntitySearchUsingUniqueIdentifierEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(searchPageActionTypes.ON_SEARCH).pipe(
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
                        const baseUrl = `${(process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '')}/#/dashboard?`;
                        const baseParams = `tei=${trackedEntityInstanceId}&ou=${orgUnitId}&program=${selectedProgramId}`;
                        const trackedEntityInstanceUrlToOldTrackerApp = `${baseUrl}${baseParams}`;
                        window.location.href = trackedEntityInstanceUrlToOldTrackerApp;
                        return {};
                    }
                    // trigger action that will display modal to inform user that results are empty.
                    return {};
                }),
            );
        }),
    );
