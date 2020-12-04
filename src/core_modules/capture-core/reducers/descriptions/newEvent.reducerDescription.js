// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
    dataEntryWrapperActionTypes as newEventDataEntryWrapperActionTypes,
    newRelationshipActionTypes as newEventNewRelationshipActionTypes,
} from '../../components/DataEntries/SingleEventRegistrationEntry';

export const newEventPageDesc = createReducerDescription({
    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
    [newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: true,
    }),
    [newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: false,
    }),
    [newEventNewRelationshipActionTypes.RECENTLY_ADDED_RELATIONSHIP]: (state, action) => ({
        ...state,
        recentlyAddedRelationshipId: action.payload.relationshipId,
    }),
    [newEventDataEntryActionTypes.SCROLLED_TO_RELATIONSHIPS]: state => ({
        ...state,
        recentlyAddedRelationshipId: null,
    }),
    [newEventNewRelationshipActionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
    [newEventDataEntryWrapperActionTypes.SET_NEW_EVENT_FORM_LAYOUT_DIRECTION]: (state, action) => {
        const newState = { ...state };
        newState.formHorizontal = action.payload.formHorizontal;
        return newState;
    },
    [newEventDataEntryActionTypes.SET_NEW_EVENT_SAVE_TYPES]: (state, action) => {
        const newState = { ...state };
        newState.saveTypes = action.payload.saveTypes;
        return newState;
    },
}, 'newEventPage');
