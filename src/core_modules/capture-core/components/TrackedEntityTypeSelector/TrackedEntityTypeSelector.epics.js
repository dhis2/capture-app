// @flow
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { buildUrlQueryString } from '../../utils/routing';
import { trackedEntityTypeSelectorActionTypes } from './TrackedEntityTypeSelector.actions';

export const setTrackedEntityTypeIdOnUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET),
        map(({ payload: { trackedEntityTypeId } }) => {
            const { currentSelections: { orgUnitId }, app: { page: currentPage } } = store.value;

            return push(`/${currentPage}?${buildUrlQueryString({ trackedEntityTypeId, orgUnitId })}`);
        }),
    );

