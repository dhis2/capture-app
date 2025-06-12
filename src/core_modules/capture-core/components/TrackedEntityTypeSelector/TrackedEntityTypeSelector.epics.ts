import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { trackedEntityTypeSelectorActionTypes } from './TrackedEntityTypeSelector.actions';
import { buildUrlQueryString } from '../../utils/routing';
import { resetLocationChange } from '../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const setTrackedEntityTypeIdOnUrlEpic = (action$: any, store: any, { navigate }: any) =>
    action$.pipe(
        ofType(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET),
        map(({ payload: { trackedEntityTypeId } }: any) => {
            const { currentSelections: { orgUnitId }, app: { page: currentPage } } = store.value;

            navigate(`/${currentPage}?${buildUrlQueryString({ trackedEntityTypeId, orgUnitId })}`);
            return resetLocationChange();
        }),
    );
