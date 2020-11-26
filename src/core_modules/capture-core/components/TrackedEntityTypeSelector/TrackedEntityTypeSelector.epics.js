// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { trackedEntityTypeSelectorActionTypes } from './TrackedEntityTypeSelector.actions';
import { urlArguments } from '../../utils/url';

export const setTrackedEntityTypeIdOnUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET),
        map(({ payload: { trackedEntityTypeId } }) => {
            const {
                currentSelections: { orgUnitId },
            } = store.value;

            return push(urlArguments({ trackedEntityTypeId, orgUnitId }));
        }),
    );

