// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as formAsyncActionTypes } from '../../components/D2Form/asyncHandlerHOC/actions';
import {
  mainActionTypes as actionTypes,
  searchGroupActionTypes,
  loadNewActionTypes,
  loadEditActionTypes,
} from '../../components/DataEntry';
import getDataEntryKey from '../../components/DataEntry/common/getDataEntryKey';

export const dataEntriesDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.dataEntryId] = { ...newState[payload.dataEntryId] };
      newState[payload.dataEntryId].itemId = payload.itemId;
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.dataEntryId] = {
        ...newState[payload.dataEntryId],
        itemId: payload.itemId,
        ...payload.extraProps,
      };
      return newState;
    },
    /*
    [loadViewActionTypes.LOAD_VIEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.dataEntryId] = {
            ...newState[payload.dataEntryId],
            itemId: payload.itemId,
            ...payload.extraProps,
        };
        return newState;
    },
    */
    [actionTypes.SET_CURRENT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.dataEntryId] = {
        ...newState[payload.dataEntryId],
        itemId: payload.itemId,
        ...payload.extraProps,
      };
      return newState;
    },
  },
  'dataEntries',
);

export const dataEntriesUIDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = {
        loaded: true,
      };
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = {
        loaded: true,
      };
      return newState;
    },
    /*
    [loadViewActionTypes.LOAD_VIEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = {
            loaded: true,
        };
        return newState;
    },
    */
    [actionTypes.SAVE_VALIDATION_FALED]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const key = getDataEntryKey(payload.id, payload.itemId);
      newState[key] = { ...newState[key] };
      newState[key].saveAttempted = true;
      return newState;
    },
    [actionTypes.SAVE_ABORT]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const key = getDataEntryKey(payload.id, payload.itemId);
      newState[key] = { ...newState[key] };
      newState[key].saveAttempted = true;
      return newState;
    },
    [actionTypes.UPDATE_FORM_FIELD]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      newState[key] = { ...newState[key] };
      newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress + 1 : 1;
      return newState;
    },
    [actionTypes.RULES_EXECUTED_POST_UPDATE_FIELD]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      newState[key] = { ...newState[key] };
      newState[key].inProgress = newState[key].inProgress ? newState[key].inProgress - 1 : 0;
      return newState;
    },
  },
  'dataEntriesUI',
);

export const dataEntriesFieldsValueDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { dataEntryValues, key } = action.payload;
      newState[key] = dataEntryValues || {};
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = payload.dataEntryValues;
      return newState;
    },
    /*
    [loadViewActionTypes.LOAD_VIEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryValues;
        return newState;
    },
    */
    [actionTypes.UPDATE_FIELD]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      newState[key] = { ...newState[key] };
      const dataEntryValues = newState[key];
      dataEntryValues[payload.fieldId] = payload.value;
      return newState;
    },
  },
  'dataEntriesFieldsValue',
);

export const dataEntriesNotesDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      newState[action.payload.key] = [];
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = payload.dataEntryNotes ? [...payload.dataEntryNotes] : [];
      return newState;
    },
    [actionTypes.ADD_DATA_ENTRY_NOTE]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      const noteKey = state[key] ? state[key].length : 0;

      newState[key] = [...state[key], { ...payload.note, key: noteKey }];
      return newState;
    },
    [actionTypes.REMOVE_DATA_ENTRY_NOTE]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);

      newState[key] = state[key].filter((n) => n.clientId !== payload.noteClientId);
      return newState;
    },
  },
  'dataEntriesNotes',
  {},
);

export const dataEntriesFieldsMetaDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = payload.dataEntryMeta;
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = payload.dataEntryMeta;
      return newState;
    },
    /*
    [loadViewActionTypes.LOAD_VIEW_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const key = payload.key;
        newState[key] = payload.dataEntryMeta;
        return newState;
    },
    */
  },
  'dataEntriesFieldsMeta',
);

export const dataEntriesFieldsUIDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
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
      const { payload } = action;
      const { key } = payload;
      newState[key] = Object.keys(payload.dataEntryUI).reduce((accValuesUI, elementKey) => {
        accValuesUI[elementKey] = {
          ...payload.dataEntryUI[elementKey],
          touched: false,
        };
        return accValuesUI;
      }, {});

      return newState;
    },
    /*
    [loadViewActionTypes.LOAD_VIEW_DATA_ENTRY]: (state, action) => {
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
    */
    [actionTypes.UPDATE_FIELD]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      newState[key] = { ...newState[key] };
      const dataEntryValuesUI = newState[key];
      dataEntryValuesUI[payload.fieldId] = {
        ...dataEntryValuesUI[payload.fieldId],
        ...payload.valueMeta,
        modified: true,
      };
      return newState;
    },
  },
  'dataEntriesFieldsUI',
);

export const dataEntriesRelationshipsDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      newState[action.payload.key] = [];
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      const { key } = payload;
      newState[key] = payload.dataEntryRelationships ? [...payload.dataEntryRelationships] : [];
      return newState;
    },
    [actionTypes.ADD_DATA_ENTRY_RELATIONSHIP]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);
      newState[key] = state[key]
        ? [...state[key], { ...payload.relationship }]
        : [{ ...payload.relationship }];
      return newState;
    },
    [actionTypes.REMOVE_DATA_ENTRY_RELATIONSHIP]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;

      const key = getDataEntryKey(payload.dataEntryId, payload.itemId);

      newState[key] = state[key].filter((r) => r.clientId !== payload.relationshipClientId);
      return newState;
    },
  },
  'dataEntriesRelationships',
  {},
);

export const dataEntriesSearchGroupsResultsDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      newState[action.payload.key] = null;
      return newState;
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const newState = { ...state };
      newState[action.payload.key] = null;
      return newState;
    },
    [searchGroupActionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIVED]: (state, action) => {
      const { count, dataEntryKey, groupId } = action.payload;
      return {
        ...state,
        [dataEntryKey]: {
          ...state[dataEntryKey],
          [groupId]: {
            ...(state[dataEntryKey] && state[dataEntryKey][groupId]),
            count,
          },
        },
      };
    },
    [searchGroupActionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED]: (state, action) => {
      const { error: countError, dataEntryKey, groupId } = action.payload;
      return {
        ...state,
        [dataEntryKey]: {
          ...state[dataEntryKey],
          [groupId]: {
            ...(state[dataEntryKey] && state[dataEntryKey][groupId]),
            countError,
          },
        },
      };
    },
    [searchGroupActionTypes.ABORT_SEARCH_GROUP_COUNT_SEARCH]: (state, action) => {
      const { dataEntryKey, groupId } = action.payload;
      return {
        ...state,
        [dataEntryKey]: {
          ...state[dataEntryKey],
          [groupId]: null,
        },
      };
    },
  },
  'dataEntriesSearchGroupsResults',
);

export const dataEntriesSearchGroupsPreviousValuesDesc = createReducerDescription(
  {
    [searchGroupActionTypes.START_SEARCH_GROUP_COUNT_SEARCH]: (state, action) => {
      const { dataEntryKey, searchGroupId, values } = action.payload;
      return {
        ...state,
        [dataEntryKey]: {
          ...state[dataEntryKey],
          [searchGroupId]: {
            ...values,
          },
        },
      };
    },
    [searchGroupActionTypes.ABORT_SEARCH_GROUP_COUNT_SEARCH]: (state, action) => {
      const { dataEntryKey, groupId } = action.payload;
      return {
        ...state,
        [dataEntryKey]: {
          ...state[dataEntryKey],
          [groupId]: null,
        },
      };
    },
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const { key } = action.payload;
      return {
        ...state,
        [key]: null,
      };
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const { key } = action.payload;
      return {
        ...state,
        [key]: null,
      };
    },
  },
  'dataEntriesSearchGroupsPreviousValues',
);

export const dataEntriesInProgressListDesc = createReducerDescription(
  {
    [loadNewActionTypes.LOAD_NEW_DATA_ENTRY]: (state, action) => {
      const { key } = action.payload;
      return {
        ...state,
        [key]: null,
      };
    },
    [loadEditActionTypes.LOAD_EDIT_DATA_ENTRY]: (state, action) => {
      const { key } = action.payload;
      return {
        ...state,
        [key]: null,
      };
    },
    [searchGroupActionTypes.FILTER_SEARCH_GROUP_FOR_COUNT_TO_BE_EXECUTED]: (state, action) => {
      const { uid, dataEntryKey } = action.payload;
      return {
        ...state,
        [dataEntryKey]: [...(state[dataEntryKey] || []), uid],
      };
    },
    [searchGroupActionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIVED]: (state, action) => {
      const { uids, dataEntryKey } = action.payload;
      const updatedList = [...(state[dataEntryKey] || []).filter((entry) => !uids.includes(entry))];

      return {
        ...state,
        [dataEntryKey]: updatedList,
      };
    },
    [searchGroupActionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED]: (state, action) => {
      const { uids, dataEntryKey } = action.payload;
      const updatedList = [...(state[dataEntryKey] || []).filter((entry) => !uids.includes(entry))];

      return {
        ...state,
        [dataEntryKey]: updatedList,
      };
    },
    [searchGroupActionTypes.ABORT_SEARCH_GROUP_COUNT_SEARCH]: (state, action) => {
      const { uids, dataEntryKey } = action.payload;
      const updatedList = [...(state[dataEntryKey] || []).filter((entry) => !uids.includes(entry))];

      return {
        ...state,
        [dataEntryKey]: updatedList,
      };
    },
    [searchGroupActionTypes.CANCEL_SEARCH_GROUP_COUNT_SEARCH]: (state, action) => {
      const { uid, dataEntryKey } = action.payload;
      const updatedList = [...(state[dataEntryKey] || []).filter((entry) => uid !== entry)];

      return {
        ...state,
        [dataEntryKey]: updatedList,
      };
    },
    [formAsyncActionTypes.FIELD_IS_VALIDATING]: (state, action) => {
      const { formId, validatingUid } = action.payload;
      const listWithPotentialDupes = [...(state[formId] || []), validatingUid];
      const listSet = new Set(listWithPotentialDupes);

      return {
        ...state,
        [formId]: Array.from(listSet),
      };
    },
    [formAsyncActionTypes.FIELDS_VALIDATED]: (state, action) => {
      const { formId, validatingUids } = action.payload;
      const updatedList = (state[formId] || []).filter((item) => !validatingUids.includes(item));
      return {
        ...state,
        [formId]: updatedList,
      };
    },
    [actionTypes.UPDATE_FORM_FIELD]: (state, action) => {
      const { formId, updateCompleteUid } = action.payload;
      const updatedList = (state[formId] || []).filter((item) => item !== updateCompleteUid);
      return {
        ...state,
        [formId]: updatedList,
      };
    },
    [formAsyncActionTypes.START_UPDATE_FIELD_ASYNC]: (state, action) => {
      const { formId, uid } = action.payload;
      return {
        ...state,
        [formId]: [...(state[formId] || []), uid],
      };
    },
    [formAsyncActionTypes.UPDATE_FIELD_FROM_ASYNC]: (state, action) => {
      const { formId, uid } = action.payload;
      const updatedList = (state[formId] || []).filter((item) => item !== uid);
      return {
        ...state,
        [formId]: updatedList,
      };
    },
    [formAsyncActionTypes.ASYNC_UPDATE_FIELD_FAILED]: (state, action) => {
      const { formId, uid } = action.payload;
      const updatedList = (state[formId] || []).filter((item) => item !== uid);
      return {
        ...state,
        [formId]: updatedList,
      };
    },
    [actionTypes.START_RUN_RULES_POST_UPDATE_FIELD]: (state, action) => {
      const { dataEntryId, itemId, uid } = action.payload;
      const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
      return {
        ...state,
        [dataEntryKey]: [...(state[dataEntryKey] || []), uid],
      };
    },
    [actionTypes.RULES_EXECUTED_POST_UPDATE_FIELD]: (state, action) => {
      const { dataEntryId, itemId, uid } = action.payload;
      const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
      const updatedList = (state[dataEntryKey] || []).filter((item) => item !== uid);
      return {
        ...state,
        [dataEntryKey]: updatedList,
      };
    },
  },
  'dataEntriesInProgressList',
);
