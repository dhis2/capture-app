// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as newEventDataEntryActionTypes,
    startSaveNewEventAfterReturnedToMainPage,
} from '../actions/dataEntry.actions';

import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';
import { getLocationQuery, buildUrlQueryString } from '../../../../../../utils/routing';
import { resetLocationChange } from '../../../../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const saveNewEventEpic = (action$: InputObservable, store: ReduxStore, { serverVersion: { minor } }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);
            const formFoundation = payload.formFoundation;
            const { formClientValues, mainDataClientValues } = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getNewEventServerData(
                state,
                formFoundation,
                formClientValues,
                mainDataClientValues,
                minor,
            );
            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return startSaveNewEventAfterReturnedToMainPage(serverData, relationshipData, state.currentSelections);
        }));

export const saveNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        map(() => {
            const { programId, orgUnitId } = getLocationQuery();

            history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return resetLocationChange();
        }));
