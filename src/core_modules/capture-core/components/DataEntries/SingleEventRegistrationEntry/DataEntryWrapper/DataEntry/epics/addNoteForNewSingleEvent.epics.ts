import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import moment from 'moment';
import type { ReduxStore, ApiUtils, EpicAction } from 'capture-core-utils/types';
import { CurrentUser } from '../../../../../../utils/userInfo/CurrentUser';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../../../DataEntry/actions/dataEntry.actions';

type AddNotePayload = {
    dataEntryId: string;
    itemId: string;
    note: string;
};

export const addNoteForNewSingleEventEpic = (
    action$: EpicAction<AddNotePayload>,
    store: ReduxStore,
    { fromClientDate }: ApiUtils,
) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.ADD_NEW_EVENT_NOTE),
        map((action) => {
            const payload = action.payload;
            const { firstName, surname } = CurrentUser.get();
            const clientId = uuid();
            const note = {
                value: payload.note,
                createdBy: {
                    firstName,
                    surname,
                    uid: clientId,
                },
                storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        }));
