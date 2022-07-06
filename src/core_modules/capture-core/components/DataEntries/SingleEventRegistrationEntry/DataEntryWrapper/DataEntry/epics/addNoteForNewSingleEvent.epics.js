// @flow
import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';

import moment from 'moment';
import { convertValue as convertListValue } from '../../../../../../converters/clientToList';
import { dataElementTypes } from '../../../../../../metaData';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../../../DataEntry/actions/dataEntry.actions';

export const addNoteForNewSingleEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.ADD_NEW_EVENT_NOTE),
        switchMap((action) => {
            const payload = action.payload;

            return querySingleResource({
                resource: 'me',
                params: {
                    fields: 'firstName,surname,userName',
                },
            }).then((user) => {
                const { userName, firstName, surname } = user;
                const clientId = uuid();
                const storedAt = moment().toISOString();
                const note = {
                    value: payload.note,
                    createdBy: {
                        firstName,
                        surname,
                        uid: clientId,
                    },
                    storedBy: userName,
                    storedAt: convertListValue(storedAt, dataElementTypes.DATETIME),
                    clientId: uuid(),
                };

                return addNote(payload.dataEntryId, payload.itemId, note);
            });
        }));
