// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as editEventDataEntryActionTypes } from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';

export const editEventPageDesc = createReducerDescription(
  {
    [editEventActionTypes.EDIT_EVENT_FROM_URL]: (state, action) => {
      const newState = { ...state };
      newState.eventId = action.payload.eventId;
      newState.isLoading = true;
      newState.loadError = null;
      return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED]: (state, action) => {
      const newState = { ...state };
      newState.isLoading = false;
      newState.loadError = action.payload;
      return newState;
    },
    [editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state) => {
      const newState = { ...state };
      newState.isLoading = false;
      newState.dataEntryIsLoading = true;
      return newState;
    },
    [editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE]: (state) => {
      const newState = { ...state };
      newState.isLoading = false;
      newState.dataEntryIsLoading = true;
      return newState;
    },
    [editEventDataEntryActionTypes.OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY]: (state) => {
      const newState = { ...state };
      newState.dataEntryIsLoading = false;
      return newState;
    },
    [editEventDataEntryActionTypes.PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY]: (
      state,
      action,
    ) => {
      const newState = { ...state };
      newState.dataEntryIsLoading = false;
      newState.dataEntryLoadError = action.payload;
      return newState;
    },
    [eventListActionTypes.OPEN_EDIT_EVENT_PAGE]: (state, action) => {
      const newState = {
        ...state,
        eventId: action.payload,
        isLoading: false,
        dataEntryIsLoading: true,
        loadError: null,
      };
      return newState;
    },
  },
  'editEventPage',
);
