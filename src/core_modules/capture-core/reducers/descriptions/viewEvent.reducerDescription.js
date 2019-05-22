// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/viewEvent.actions';
import { actionTypes as viewEventRelationshipsActionTypes } from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import {
    actionTypes as viewEventDetailsActionTypes,
} from '../../components/Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import {
    actionTypes as viewEventDataEntryActionTypes,
} from '../../components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/editEventDataEntry.actions';

import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import { actionTypes as viewEventNotesActionTypes } from '../../components/Pages/ViewEvent/Notes/viewEventNotes.actions';


export const viewEventPageDesc = createReducerDescription({
    [viewEventActionTypes.VIEW_EVENT_FROM_URL]: (state, action) => {
        const newState = {
            eventDetailsSection: {},
            notesSection: { isLoading: true },
            relationshipsSection: { isLoading: true },
            eventId: action.payload.eventId,
            dataEntryIsLoading: true,
            isLoading: true,
        };
        return newState;
    },
    [viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW]: (state, action) => {
        const newState = { ...state };
        newState.eventContainer = {
            ...action.payload.eventContainer,
        };
        return newState;
    },
    [viewEventActionTypes.OPEN_VIEW_EVENT_PAGE_FAILED]: (state, action) => ({
        ...state,
        loadError: action.payload.error,
    }),
    [viewEventActionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.loadError = action.payload;
        return newState;
    },
    [viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.dataEntryIsLoading = true;
        newState.eventContainer = {
            ...action.payload.eventContainer,
        };
        return newState;
    },
    [viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.dataEntryIsLoading = true;
        newState.eventContainer = {
            ...action.payload.eventContainer,
        };
        return newState;
    },
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        newState.eventDetailsSection = {
            ...newState.eventDetailsSection,
        };
        return newState;
    },
    [viewEventDataEntryActionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        newState.dataEntryLoadError = action.payload;
        return newState;
    },
    [eventListActionTypes.OPEN_VIEW_EVENT_PAGE]: (state, action) => {
        const newState = {
            eventDetailsSection: {},
            notesSection: { isLoading: true },
            relationshipsSection: { isLoading: true },
            eventId: action.payload,
            dataEntryIsLoading: true,
        };
        return newState;
    },
    [viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: true,
    }),
    [viewEventRelationshipsActionTypes.EVENT_RELATIONSHIPS_LOADED]: state => ({
        ...state,
        relationshipsSection: {
            ...state.relationshipsSection,
            isLoading: false,
        },
    }),
    [viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: false,
    }),
    [viewEventRelationshipsActionTypes.EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
    [viewEventNotesActionTypes.EVENT_NOTES_LOADED]: state => ({
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
    [viewEventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
        },
    }),
    [viewEventDetailsActionTypes.SHOW_EDIT_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: true,
        },
    }),
    [editEventDataEntryActionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: false,
        },
    }),
    [editEventDataEntryActionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY]: (state, action) => ({
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
    [viewEventActionTypes.UPDATE_EVENT_CONTAINER]: (state, action) => ({
        ...state,
        prevEventContainer: {
            ...state.eventContainer,
        },
        eventContainer: {
            ...action.payload.eventContainer,
        },
    }),
}, 'viewEventPage');
