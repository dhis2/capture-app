// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { actionTypes as viewEventRelationshipsActionTypes } from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import { actionTypes as viewEventDetailsActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import { actionTypes as viewEventDataEntryActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import { actionTypes as editEventDataEntryActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/editEventDataEntry.actions';

import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import { actionTypes as viewEventNotesActionTypes } from '../../components/Pages/ViewEvent/Notes/viewEventNotes.actions';
import { assigneeSectionActionTypes } from '../../components/Pages/ViewEvent/RightColumn/AssigneeSection';

export const viewEventPageDesc = createReducerDescription(
  {
    [viewEventActionTypes.VIEW_EVENT_FROM_URL]: (state, action) => {
      const newState = {
        eventDetailsSection: {},
        notesSection: { isLoading: true },
        relationshipsSection: { isLoading: true },
        assigneeSection: { isLoading: true },
        eventId: action.payload.eventId,
      };
      return newState;
    },
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: (state, action) => {
      const newState = { ...state };
      newState.eventDetailsSection = {
        ...newState.eventDetailsSection,
      };
      newState.loadedValues = action.payload.loadedValues;
      newState.assigneeSection = {
        isLoading: false,
        assignee: action.payload.assignee,
      };
      return newState;
    },
    [eventListActionTypes.OPEN_VIEW_EVENT_PAGE]: (state, action) => {
      const newState = {
        eventDetailsSection: {},
        notesSection: { isLoading: true },
        relationshipsSection: { isLoading: true },
        assigneeSection: { isLoading: true },
        eventId: action.payload,
      };
      return newState;
    },
    [viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP]: (state) => ({
      ...state,
      showAddRelationship: true,
    }),
    [viewEventRelationshipsActionTypes.EVENT_RELATIONSHIPS_LOADED]: (state) => ({
      ...state,
      relationshipsSection: {
        ...state.relationshipsSection,
        isLoading: false,
      },
    }),
    [viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP]: (state) => ({
      ...state,
      showAddRelationship: false,
    }),
    [viewEventRelationshipsActionTypes.EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
      const newState = { ...state };
      newState.showAddRelationship = false;
      return newState;
    },
    [viewEventNotesActionTypes.EVENT_NOTES_LOADED]: (state) => ({
      ...state,
      notesSection: {
        ...state.notesSection,
        isLoading: false,
      },
    }),
    [viewEventNotesActionTypes.UPDATE_EVENT_NOTE_FIELD]: (state, action) => ({
      ...state,
      notesSection: {
        ...state.notesSection,
        fieldValue: action.payload.value,
      },
    }),
    [viewEventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY]: (state) => ({
      ...state,
      eventDetailsSection: {
        ...state.eventDetailsSection,
      },
    }),
    [viewEventDetailsActionTypes.SHOW_EDIT_EVENT_DATA_ENTRY]: (state) => ({
      ...state,
      eventDetailsSection: {
        ...state.eventDetailsSection,
        showEditEvent: true,
      },
    }),
    [editEventDataEntryActionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY]: (state) => ({
      ...state,
      eventDetailsSection: {
        ...state.eventDetailsSection,
        showEditEvent: false,
      },
    }),
    [editEventDataEntryActionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY]: (state) => ({
      ...state,
      saveInProgress: true,
      eventDetailsSection: {
        ...state.eventDetailsSection,
        showEditEvent: false,
      },
    }),
    [editEventDataEntryActionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED]: (state, action) => {
      if (action.meta.eventId !== state.eventId) {
        return state;
      }
      return {
        ...state,
        saveInProgress: false,
      };
    },
    [editEventDataEntryActionTypes.EDIT_EVENT_DATA_ENTRY_SAVED]: (state, action) => {
      if (action.meta.eventId !== state.eventId) {
        return state;
      }
      return {
        ...state,
        saveInProgress: false,
        eventHasChanged: true,
      };
    },
    [assigneeSectionActionTypes.VIEW_EVENT_ASSIGNEE_SET]: (state, action) => {
      const { assignee } = action.payload;

      const newState = {
        ...state,
        saveInProgress: true,
        loadedValues: {
          ...state.loadedValues,
          eventContainer: {
            ...state.loadedValues.eventContainer,
            event: {
              ...state.loadedValues.eventContainer.event,
              assignee,
            },
          },
        },
      };

      return newState;
    },
    [assigneeSectionActionTypes.VIEW_EVENT_ASSIGNEE_SAVE_COMPLETED]: (state, action) => {
      if (action.meta.eventId !== state.eventId) {
        return state;
      }

      return {
        ...state,
        saveInProgress: false,
        eventHasChanged: true,
      };
    },
    [assigneeSectionActionTypes.VIEW_EVENT_ASSIGNEE_SAVE_FAILED]: (state, action) => {
      if (action.meta.eventId !== state.eventId) {
        return state;
      }

      return {
        ...state,
        saveInProgress: false,
      };
    },
  },
  'viewEventPage',
);
