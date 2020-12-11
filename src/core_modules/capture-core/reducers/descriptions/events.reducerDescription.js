// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as enrollmentActionTypes } from '../../actions/__TEMP__/enrollment.actions';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';

export const eventsDesc = createReducerDescription(
  {
    [enrollmentActionTypes.ENROLLMENT_LOADED]: (state, action) => {
      const eventContainers = action.payload;
      if (!eventContainers || eventContainers.length === 0) {
        return state;
      }

      const newEventsById = eventContainers.reduce((accEventsById, eventContainer) => {
        accEventsById[eventContainer.id] = eventContainer.event;
        return accEventsById;
      }, {});

      const newState = { ...state, ...newEventsById };
      return newState;
    },
    [dataEntryActionTypes.SAVE_EVENT]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.eventId] = payload.event;
      return newState;
    },
    [dataEntryActionTypes.COMPLETE_EVENT]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.eventId] = payload.event;
      return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
      const { event } = action.payload.eventContainer;
      const newState = {
        ...state,
        [event.eventId]: event,
      };
      return newState;
    },
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
      const { event } = action.payload.eventContainer;
      const newState = {
        ...state,
        [event.eventId]: event,
      };
      return newState;
    },
    [viewEventActionTypes.ADD_EVENT_NOTE]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      if (newState[payload.eventId]) {
        newState[payload.eventId].notes = [...state[payload.eventId].notes, payload.note];
      }
      return newState;
    },
    [viewEventActionTypes.REMOVE_EVENT_NOTE]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      if (newState[payload.eventId]) {
        newState[payload.eventId].notes = state[payload.eventId].notes.filter(
          (n) => n.clientId !== payload.noteClientId,
        );
      }
      return newState;
    },
  },
  'events',
  {},
);

export const eventsValuesDesc = createReducerDescription(
  {
    [enrollmentActionTypes.ENROLLMENT_LOADED]: (state, action) => {
      const eventContainers = action.payload;
      if (!eventContainers || eventContainers.length === 0) {
        return state;
      }

      const newEventsValuesById = eventContainers.reduce((accEventsValuesById, eventContainer) => {
        accEventsValuesById[eventContainer.id] = eventContainer.values;
        return accEventsValuesById;
      }, {});

      const newState = { ...state, ...newEventsValuesById };
      return newState;
    },
    [dataEntryActionTypes.COMPLETE_EVENT]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.eventId] = action.payload.clientValues;
      return newState;
    },
    [dataEntryActionTypes.SAVE_EVENT]: (state, action) => {
      const newState = { ...state };
      const { payload } = action;
      newState[payload.eventId] = action.payload.clientValues;
      return newState;
    },
  },
  'eventsValues',
  {},
);
