// @flow
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import {
    actionTypes as newEventDataEntryActionTypes,
    startSaveNewEventAfterReturnedToMainPage,
} from '../actions/dataEntry.actions';

import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';
import { deriveURLParamsFromHistory } from '../../../../../../utils/routing';
import { urlArguments } from '../../../../../../utils/url';

export const saveNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);
            const formFoundation = payload.formFoundation;
            const { formClientValues, mainDataClientValues } = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getNewEventServerData(state, formFoundation, formClientValues, mainDataClientValues);
            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return startSaveNewEventAfterReturnedToMainPage(serverData, relationshipData, state.currentSelections);
        }));

export const saveNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        switchMap(() => {
            const { pathname } = history.location;
            const { enrollmentId, programId, orgUnitId } = deriveURLParamsFromHistory(history);

            if (pathname === '/enrollmentEventNew') {
                history.push(`/enrollment?${urlArguments({ enrollmentId })}`);
                return EMPTY;
            }

            history.push(`/${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }));
