// @flow
import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import moment from 'capture-core-utils/moment/momentResolver';
import { convertValue as convertListValue } from '../../../../../converters/clientToList';
import elementTypes from '../../../../../metaData/DataElement/elementTypes';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addNote,
} from '../../../../DataEntry/actions/dataEntry.actions';
import { getCurrentUser } from '../../../../../d2/d2Instance';

export const addNoteForNewSingleEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.ADD_NEW_EVENT_NOTE),
        map((action) => {
            const {payload} = action;
            // $FlowFixMe[prop-missing] automated comment
            const userName = getCurrentUser().username;

            const storedDate = moment().toISOString();
            const note = {
                value: payload.note,
                storedBy: userName,
                // $FlowFixMe[prop-missing] automated comment
                storedDate: convertListValue(storedDate, elementTypes.DATETIME),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        }));
