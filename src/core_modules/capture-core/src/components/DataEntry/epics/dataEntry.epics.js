// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { ensureState } from 'redux-optimistic-ui';
import { batchActions } from 'redux-batched-actions';

import { convertStateFormValuesToClient } from '../../../converters/helpers/formToClient';
import { convertClientValuesToServer } from '../../../converters/helpers/clientToServer';
import convertDataEntryValuesToEventValues from '../common/convertDataEntryValuesToEventValues';
import convertEventToServerValues from '../common/convertEventToServerValues';

import {
    actionTypes,
    completeEvent,
    completeEventError,
    saveEvent,
    saveEventError,
} from '../actions/dataEntry.actions';
import { actionTypes as dataEntryLoadTypes, loadDataEntryEvent, openDataEntryEventAlreadyLoaded } from '../actions/dataEntryLoad.actions';

import getDataEntryKey from '../common/getDataEntryKey';
import { getRulesActionsOnUpdate } from '../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

import type { FieldData } from '../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';

export const loadDataEntryEpic = (action$, store: ReduxStore) =>
    action$.ofType(dataEntryLoadTypes.START_LOAD_DATA_ENTRY_EVENT)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
            const isAlreadyLoaded = !!(state.dataEntriesUI[key] && state.dataEntriesUI[key].loaded);

            if (isAlreadyLoaded) {
                return openDataEntryEventAlreadyLoaded(payload.eventId, payload.dataEntryId);
            }

            return loadDataEntryEvent(payload.eventId, store.getState(), payload.eventPropsToInclude, payload.dataEntryId);
        });

function convertForSaveAndComplete(state: ReduxState, eventId: string, id: string) {
    const clientValuesContainer = convertStateFormValuesToClient(eventId, state);
    if (clientValuesContainer.error) {
        return {
            error: clientValuesContainer.error,
            clientValues: null,
            serverData: null,
            eventMainData: null,
        };
    }
    const clientValues = clientValuesContainer.values;

    const oldEvent = ensureState(state.events)[eventId];
    const eventMainData = { ...oldEvent, ...convertDataEntryValuesToEventValues(state, eventId, id) };

    // $FlowSuppress : TODO - TEI
    const serverValues = convertClientValuesToServer(clientValues, clientValuesContainer.stage) || {};
    const serverValuesAsArray = Object
        .keys(serverValues)
        .map(key => ({ dataElement: key, value: serverValues[key] }));
    const serverMainData = convertEventToServerValues(eventMainData);
    const serverData = { ...serverMainData, dataValues: serverValuesAsArray };

    return {
        clientValues,
        serverData,
        eventMainData,
        error: null,
    };
}

export const completeEventEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.START_COMPLETE_EVENT)
        .map((action) => {
            const { eventId, id } = action.payload;
            const state = store.getState();
            const { error, clientValues, serverData, eventMainData } = convertForSaveAndComplete(state, eventId, id);

            if (error) {
                return completeEventError(error, id);
            }

            // $FlowSuppress
            return completeEvent(clientValues, serverData, eventMainData, eventId, id);
        });

export const saveEventEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.START_SAVE_EVENT)
        .map((action) => {
            const { eventId, id } = action.payload;
            const state = store.getState();
            const { error, clientValues, serverData, eventMainData } = convertForSaveAndComplete(state, eventId, id);

            if (error) {
                return saveEventError(error, id);
            }

            // $FlowSuppress
            return saveEvent(clientValues, serverData, eventMainData, eventId, id);
        });

/*
export const rulesEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.UPDATE_FORM_FIELD)
        .map((action) => {
            const payload = action.payload;
            const fieldData: FieldData = {
                elementId: payload.elementId,
                value: payload.value,
                valid: payload.uiState.valid,
            };
            const actions = getRulesActionsOnUpdate(payload.eventId, store.getState(), payload.formId, payload.dataEntryId, fieldData);
            return batchActions(actions);
        });
*/