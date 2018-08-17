// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import { actionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as loadNewActionTypes } from '../../components/DataEntry/actions/dataEntryLoadNew.actions';
import { actionTypes as loadEditActionTypes } from '../../components/DataEntry/actions/dataEntryLoadEdit.actions';

import getDataEntryKey from '../../components/DataEntry/common/getDataEntryKey';

export const dataEntriesDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
        newState[payload.dataEntryId].itemId = payload.itemId;
        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = {
            ...newState[payload.dataEntryId],
            itemId: payload.itemId,
            ...payload.extraProps,
        };
        return newState;
    },
    /*
    [loadActionTypes.OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
        newState[payload.dataEntryId].eventId = payload.eventId;
        return newState;
    },
    */
}, 'dataEntries');

export const dataEntriesUIDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = {
            loaded: true,
        };
        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = {
            loaded: true,
        };
        return newState;
    },
    /*
    REWRITE COMPLETE COMPONENT
    [actionTypes.COMPLETE_VALIDATION_FAILED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].completionAttempted = true;
        return newState;
    },
    [actionTypes.COMPLETE_ABORT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].completionAttempted = true;
        return newState;
    },
    */
    [actionTypes.SAVE_VALIDATION_FALED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.itemId);
        newState[key] = { ...newState[key] };
        newState[key].saveAttempted = true;
        return newState;
    },
    [actionTypes.SAVE_ABORT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.itemId);
        newState[key] = { ...newState[key] };
        newState[key].saveAttempted = true;
        return newState;
    },
    /*
    FINAL IN PROGRESS
    [actionTypes.START_SAVE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].finalInProgress = true;
        return newState;
    },
    [actionTypes.SAVE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.id, payload.eventId);
        newState[key] = { ...newState[key] };
        newState[key].finalInProgress = false;
        return newState;
    },
    */
    [actionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
        newState[key] = { ...newState[key] };
        newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress + 1 : 1;
        return newState;
    },
    [actionTypes.RULES_EXECUTED_POST_UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
        newState[key] = { ...newState[key] };
        newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress - 1 : 0;
        return newState;
    },
}, 'dataEntriesUI');


export const dataEntriesFieldsValueDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = {};
        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryValues;
        return newState;
    },
    [actionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
        newState[key] = { ...newState[key] };
        const dataEntryValues = newState[key];
        dataEntryValues[payload.fieldId] = payload.value;
        return newState;
    },
}, 'dataEntriesFieldsValue');

export const dataEntriesNotesDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.key] = [];
        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryNotes ? [...payload.dataEntryNotes] : [];
        return newState;
    },
    [actionTypes.ADD_NOTE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
        const noteKey = state[key] ? state[key].length : 0;

        newState[key] = [...state[key], { ...payload.formNote, key: noteKey }];
        return newState;
    },
    [actionTypes.REMOVE_NOTE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);

        newState[key] = state[key].filter(n => n.clientId !== payload.noteClientId);
        return newState;
    },
}, 'dataEntriesNotes', {});

export const dataEntriesFieldsMetaDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryMeta;
        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryMeta;
        return newState;
    },
}, 'dataEntriesFieldsMeta');

export const dataEntriesFieldsUIDesc = createReducerDescription({
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = Object.keys(payload.dataEntryUI).reduce((accValuesUI, elementKey) => {
            accValuesUI[elementKey] = {
                ...payload.dataEntryUI[elementKey],
                touched: false,
            };
            return accValuesUI;
        }, {});

        return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = Object.keys(payload.dataEntryUI).reduce((accValuesUI, elementKey) => {
            accValuesUI[elementKey] = {
                ...payload.dataEntryUI[elementKey],
                touched: false,
            };
            return accValuesUI;
        }, {});

        return newState;
    },
    [actionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
        newState[key] = { ...newState[key] };
        const dataEntryValuesUI = newState[key];
        dataEntryValuesUI[payload.fieldId] = { ...dataEntryValuesUI[payload.fieldId], ...payload.valueMeta };
        return newState;
    },
}, 'dataEntriesFieldsUI');
