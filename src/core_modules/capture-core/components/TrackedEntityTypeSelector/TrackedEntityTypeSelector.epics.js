// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { trackedEntityTypeSelectorActionTypes } from './TrackedEntityTypeSelector.actions';
import { urlArguments } from '../../utils/url';

export const setTrackedEntityTypeIdOnUrlEpic = (action$: InputObservable, store: ReduxStore, { history }) =>
    action$.pipe(
        ofType(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET),
        switchMap(({ payload: { trackedEntityTypeId } }) => {
            const { currentSelections: { orgUnitId }, app: { page: currentPage } } = store.value;

            history.push(`/${currentPage}?${urlArguments({ trackedEntityTypeId, orgUnitId })}`);
            return EMPTY;
        }),
    );

