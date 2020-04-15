// @flow
import { push } from 'react-router-redux';
import moment from '../../../../../utils/moment/momentResolver';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from '../../../../../utils/date';
import {
    actionTypes as editEventDataEntryActionTypes,
    startSaveEditEventAfterReturnedToMainPage,
} from '../editEventDataEntry.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import convertDataEntryToClientValues from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { convertMainEventClientToServerWithKeysMap } from '../../../../../events/mainEventConverter';

export const saveEditEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
            const eventId = state.dataEntries[payload.dataEntryId].eventId;

            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = state.events[eventId];
            const formFoundation = payload.formFoundation;

            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
                prevEventMainData,
            );
            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };

            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServerWithKeysMap(mainDataClientValues);

            if (mainDataServerValues.status === 'COMPLETED' && !prevEventMainData.completedDate) {
                mainDataServerValues.completedDate = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
            }

            const serverData = {
                ...mainDataServerValues,
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    })),
            };

            return startSaveEditEventAfterReturnedToMainPage(eventId, serverData, state.currentSelections);
        });

export const saveEditEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            return push(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });
