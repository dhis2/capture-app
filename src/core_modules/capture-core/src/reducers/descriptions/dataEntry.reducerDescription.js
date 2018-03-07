// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import { actionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as rulesEngineActionTypes } from '../../rulesEngineActionsCreator/rulesEngine.actions';

import getDataEntryKey from '../../components/DataEntry/common/getDataEntryKey';

export const dataEntriesDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].eventId = payload.eventId;
        return newState;
    },
    [actionTypes.OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
        newState[payload.dataEntryId].eventId = payload.eventId;
        return newState;
    },
}, 'dataEntries');

export const dataEntriesUIDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = {
            loaded: true,
        };
        return newState;
    },
    [actionTypes.COMPLETE_VALIDATION_FAILED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].completionAttempted = true;
        return newState;
    },
    [actionTypes.SAVE_VALIDATION_FALED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].saveAttempted = true;
        return newState;
    },
    [actionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress + 1 : 1;
        return newState;
    },
    [rulesEngineActionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress - 1 : 0;
        return newState;
    },
}, 'dataEntriesUI');


export const dataEntriesValuesDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = payload.dataEntryValues;
        return newState;
    },
    [actionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
        newState[key] = { ...newState[key] };
        const dataEntryValues = newState[key];
        dataEntryValues[payload.fieldId] = payload.value;
        return newState;
    },
}, 'dataEntriesValues');

export const dataEntriesValuesMetaDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = Object.keys(payload.dataEntryTypes).reduce((accValuesMeta, elementKey) => {
            accValuesMeta[elementKey] = {
                validationError: null,
                isValid: true,
                touched: false,
                type: payload.dataEntryTypes[elementKey],
            };
            return accValuesMeta;
        }, {});

        return newState;
    },
    [actionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
        newState[key] = { ...newState[key] };
        const dataEntryValuesMeta = newState[key];
        dataEntryValuesMeta[payload.fieldId] = { ...dataEntryValuesMeta[payload.fieldId], ...payload.valueMeta };
        return newState;
    },
}, 'dataEntriesValuesMeta');
