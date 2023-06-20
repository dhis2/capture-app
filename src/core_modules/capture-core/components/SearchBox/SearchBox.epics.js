// @flow
import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { searchBoxActionTypes } from './SearchBox.actions';
import { buildUrlQueryString } from '../../utils/routing';

export const navigateToNewTrackedEntityPageEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { history }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.NAVIGATE_TO_NEW_TRACKED_ENTITY_PAGE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId, trackedEntityTypeId } } = store.value;
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, trackedEntityTypeId })}`);

            return EMPTY;
        }),
    );
