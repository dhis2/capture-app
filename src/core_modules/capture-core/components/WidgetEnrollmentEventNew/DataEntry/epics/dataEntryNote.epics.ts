import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { ApiUtils, ReduxStore } from 'capture-core-utils/types';
import { CurrentUser } from '../../../../utils/userInfo/CurrentUser';
import {
    newEventWidgetDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../DataEntry/actions/dataEntry.actions';

export const addNoteForNewEnrollmentEventEpic = (
    action$: any,
    store: ReduxStore,
    { fromClientDate }: ApiUtils,
) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD),
        map((action: any) => {
            const payload = action.payload;
            const { firstName, surname, username } = CurrentUser.get();
            const clientId = uuid();
            const note = {
                value: payload.note,
                createdBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                storedBy: username,
                storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        }));
