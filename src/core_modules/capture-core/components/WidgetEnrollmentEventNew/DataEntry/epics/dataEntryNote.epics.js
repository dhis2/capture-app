// @flow
import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import moment from 'moment';
import {
    newEventWidgetDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../DataEntry/actions/dataEntry.actions';

export const addNoteForNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, fromClientDate }: ApiUtils) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD),
        switchMap((action) => {
            const payload = action.payload;

            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName,surname,username',
                },
            }).then((user) => {
                const { userName, firstName, surname } = user;
                const clientId = uuid();
                const note = {
                    value: payload.note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
                    clientId: uuid(),
                };

                return addNote(payload.dataEntryId, payload.itemId, note);
            });
        }));
