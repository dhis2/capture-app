// @flow
import { replace } from 'react-router-redux';
import { isString, isObject } from 'd2-utilizr';
import log from 'loglevel';
import errorCreator from '../../../../../utils/errorCreator';
import moment from '../../../../../utils/moment/momentResolver';
import {
    actionTypes as newEventDataEntryActionTypes,
    newEventSavedAfterReturnedToMainPage,
    saveFailedForNewEventAfterReturnedToMainPage,
} from '../newEventDataEntry.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import convertDataEntryToClientValues from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { convertMainEventClientToServerWithKeysMap } from '../../../../../events/mainEventConverter';
import { getApi, getTranslation } from '../../../../../d2/d2Instance';
import { formatterOptions } from '../../../../../utils/string/format.const';

export const saveNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_SAVE_RETURN_TO_MAIN_PAGE)
        .switchMap((action) => {
            const state = store.getState();
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);

            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = {};
            const formFoundation = payload.formFoundation;

            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
                prevEventMainData,
            );
            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues };

            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServerWithKeysMap(mainDataClientValues);

            if (mainDataServerValues.status === 'COMPLETED') {
                mainDataServerValues.completedDate = moment().format('YYYY-MM-DD');
            }

            const serverData = {
                ...mainDataServerValues,
                program: state.currentSelections.programId,
                programStage: formFoundation.id,
                orgUnit: state.currentSelections.orgUnitId,
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    })),
            };

            return getApi().post('events', serverData)
                .then(() => newEventSavedAfterReturnedToMainPage())
                .catch((error) => {
                    const errorMessage = isString(error) ? error : error.message;
                    const errorObject = isObject(error) ? error : null;
                    log.error(errorCreator(errorMessage || getTranslation('error_saving_event'))(errorObject));
                    return saveFailedForNewEventAfterReturnedToMainPage(
                        getTranslation(
                            'error_saving_event',
                            formatterOptions.CAPITALIZE_FIRST_LETTER,
                        ),
                    );
                });
        });

export const saveNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            return replace(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });
