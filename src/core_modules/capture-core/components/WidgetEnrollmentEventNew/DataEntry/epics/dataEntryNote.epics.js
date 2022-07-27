// @flow
import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import moment from 'moment';
import { convertValue as convertListValue } from '../../../../converters/clientToList';
import { dataElementTypes } from '../../../../metaData';
import {
    newEventWidgetDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../DataEntry/actions/dataEntry.actions';

export const addNoteForNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD),
        switchMap((action) => {
            const payload = action.payload;

            return querySingleResource({ resource: 'me', fields: 'name' }).then((user) => {
                const storedAt = moment().toISOString();
                const note = {
                    value: payload.note,
                    storedBy: user.name,
                    storedAt: convertListValue(storedAt, dataElementTypes.DATETIME),
                    clientId: uuid(),
                };

                return addNote(payload.dataEntryId, payload.itemId, note);
            });
        }));
