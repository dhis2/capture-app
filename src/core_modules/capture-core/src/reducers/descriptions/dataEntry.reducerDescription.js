// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../components/DataEntry/actions/dataEntry.actions';

export const dataEntriesDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].eventId = payload.eventId;
        return newState;
    },
    [actionTypes.COMPLETE_VALIDATION_FAILED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].completionAttempted = true;
        return newState;
    },
    [actionTypes.SAVE_VALIDATION_FALED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].saveAttempted = true;
        return newState;
    },
}, 'dataEntries');

export const dataEntriesValuesDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = payload.dataEntryValues;
        return newState;
    },
    [actionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
        const dataEntryValues = newState[payload.dataEntryId];
        dataEntryValues[payload.fieldId] = payload.value;
        return newState;
    },
}, 'dataEntriesValues');

export const dataEntriesValuesMetaDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = Object.keys(payload.dataEntryValues).reduce((accValuesMeta, key) => {
            accValuesMeta[key] = {
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
        newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
        const dataEntryValuesMeta = newState[payload.dataEntryId];
        dataEntryValuesMeta[payload.fieldId] = payload.valueMeta;
        return newState;
    },
}, 'dataEntriesValuesMeta');
