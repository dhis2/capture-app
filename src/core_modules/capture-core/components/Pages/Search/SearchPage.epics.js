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

            const queryArgs = {
                filter: ['lZGmxYbs97q:eq:8817033'],
                program: selectedProgramId,
                pageNumber: 50,
                ouMode: 'ACCESSIBLE',
            };
            const attributes = getTrackerProgram(selectedProgramId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map((item) => {
                    const l = item;
                    return {};
                }),
            );
        }),
    );
