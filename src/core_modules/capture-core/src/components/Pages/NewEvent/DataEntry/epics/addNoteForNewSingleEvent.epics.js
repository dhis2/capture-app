// @flow
import uuid from 'd2-utilizr/src/uuid';
import moment from '../../../../../utils/moment/momentResolver';
import { convertValue as convertListValue } from '../../../../../converters/clientToList';
import elementTypes from '../../../../../metaData/DataElement/elementTypes';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../newEventDataEntry.actions';

import {
    addNote,
} from '../../../../DataEntry/actions/dataEntry.actions';
import { getCurrentUser } from '../../../../../d2/d2Instance';

export const addNoteForNewSingleEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.ADD_NEW_EVENT_NOTE)
        .map((action) => {
            const payload = action.payload;
            const userName = getCurrentUser().username;

            const storedDate = moment().toISOString();
            const note = {
                value: payload.note,
                storedBy: userName,
                storedDate: convertListValue(elementTypes.DATETIME, storedDate),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        });
