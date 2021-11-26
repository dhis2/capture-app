// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { trackedEntityTypeSelectorActionTypes } from './TrackedEntityTypeSelector.actions';
import { buildUrlQueryString } from '../../utils/routing';

export const setTrackedEntityTypeIdOnUrlEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET),
        switchMap(({ payload: { trackedEntityTypeId } }) => {
            const { currentSelections: { orgUnitId }, app: { page: currentPage } } = store.value;

            history.push(`/${currentPage}?${buildUrlQueryString({ trackedEntityTypeId, orgUnitId })}`);
            return EMPTY;
        }),
    );

