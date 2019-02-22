// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/viewEvent.actions';
import { actionTypes as viewEventNewRelationshipActionTypes } from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
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
        const newState = { ...state };
        newState.eventId = action.payload.eventId;
        newState.isLoading = true;
        newState.loadError = null;
        return newState;
    },
    [viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW]: (state, action) => {
        const newState = { ...state };
        newState.eventContainer = {
            ...action.payload.eventContainer,
        };
        return newState;
    },
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
            ...state,
            eventDetailsSection: {},
            eventId: action.payload,
            isLoading: false,
            dataEntryIsLoading: true,
            loadError: null,
        };
        return newState;
    },
    [viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: true,
    }),
    [viewEventNewRelationshipActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: false,
    }),
    [viewEventNewRelationshipActionTypes.EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
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
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: false,
        },
    }),
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
