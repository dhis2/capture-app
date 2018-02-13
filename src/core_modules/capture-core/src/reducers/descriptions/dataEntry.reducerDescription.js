// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
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
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state,action) => {
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
        newState[key] = Object.keys(payload.dataEntryValues).reduce((accValuesMeta, valueKey) => {
            accValuesMeta[valueKey] = {
                validationError: null,
                isValid: true,
                touched: false,
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
        dataEntryValuesMeta[payload.fieldId] = payload.valueMeta;
        return newState;
    },
}, 'dataEntriesValuesMeta');
