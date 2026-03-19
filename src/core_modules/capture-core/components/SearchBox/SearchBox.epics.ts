import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { searchBoxActionTypes } from './SearchBox.actions';
import { buildUrlQueryString } from '../../utils/routing';

export const navigateToNewTrackedEntityPageEpic = (
    action$: any,
    store: any,
    { navigate }: any,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.NAVIGATE_TO_NEW_TRACKED_ENTITY_PAGE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId, trackedEntityTypeId } } = store.value;
            navigate(`/new?${buildUrlQueryString({ programId, orgUnitId, trackedEntityTypeId })}`);

            return EMPTY;
        }),
    );
