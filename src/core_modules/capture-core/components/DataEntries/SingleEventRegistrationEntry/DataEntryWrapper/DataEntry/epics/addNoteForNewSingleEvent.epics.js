// @flow
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'moment';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { convertValue as convertListValue } from '../../../../../../converters/clientToList';
import { getCurrentUser } from '../../../../../../d2/d2Instance';
import { dataElementTypes } from '../../../../../../metaData';
import {
    addNote,
} from '../../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../actions/dataEntry.actions';


export const addNoteForNewSingleEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.ADD_NEW_EVENT_NOTE),
        map((action) => {
            const payload = action.payload;
            // $FlowFixMe[prop-missing] automated comment
            const userName = getCurrentUser().username;

            const storedDate = moment().toISOString();
            const note = {
                value: payload.note,
                storedBy: userName,
                storedDate: convertListValue(storedDate, dataElementTypes.DATETIME),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        }));
