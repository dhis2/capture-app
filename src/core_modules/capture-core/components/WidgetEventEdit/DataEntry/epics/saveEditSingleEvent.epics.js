// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import {
    actionTypes as editEventDataEntryActionTypes,
    startSaveEditEventAfterReturnedToMainPage,
} from '../editEventDataEntry.actions';

import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { convertDataEntryToClientValues } from '../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../events/mainConverters';
import { getLocationQuery, buildUrlQueryString } from '../../../../utils/routing';
import { resetLocationChange } from '../../../LockedSelector/QuickSelector/actions/QuickSelector.actions';

export const saveEditEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        map((action) => {
            const state = store.value;
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
            );
            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };

            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);

            if (mainDataServerValues.status === 'COMPLETED' && !prevEventMainData.completedAt) {
                mainDataServerValues.completedAt = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
            }

            const serverData = {
                events: [{
                    ...mainDataServerValues,
                    dataValues: Object
                        .keys(formServerValues)
                        .map(key => ({
                            dataElement: key,
                            value: formServerValues[key],
                        })),
                }],
            };

            return startSaveEditEventAfterReturnedToMainPage(serverData, state.currentSelections);
        }));

export const saveEditEventLocationChangeEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
        map(() => {
            const { programId, orgUnitId } = getLocationQuery();
            history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return resetLocationChange();
        }));
