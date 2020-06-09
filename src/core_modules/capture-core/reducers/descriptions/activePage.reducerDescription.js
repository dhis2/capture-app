// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/actions';
import {
    actionTypes as viewEventActionTypes,
    actionTypes as viewEventPageActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../components/Pages/NewEvent';
import { actionTypes as viewEventDataEntryActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList';

export const searchPageDesc = createReducerDescription({
    [lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: state => ({
        ...state,
        isLoading: true,
    }),
    [lockedSelectorActionTypes.VALID_SELECTIONS_FROM_URL]: state => ({
        ...state,
        selectionsError: null,
        isLoading: false,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),

    [viewEventPageActionTypes.VIEW_EVENT_FROM_URL]: state => ({
        ...state,
        dataEntryIsLoading: true,
        isLoading: true,
    }),
    [viewEventDataEntryActionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        dataEntryIsLoading: false,
        viewEventLoadError: action.payload,
    }),
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
    [eventListActionTypes.OPEN_VIEW_EVENT_PAGE]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
    [viewEventPageActionTypes.OPEN_VIEW_EVENT_PAGE_FAILED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload.error,
    }),
    [viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: state => ({
        ...state,
        dataEntryIsLoading: true,
        isLoading: false,
    }),
    [viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE]: state => ({
        ...state,
        dataEntryIsLoading: true,
        isLoading: false,
    }),
    [viewEventPageActionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload,
        isLoading: false,
    }),

    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
    [newEventDataEntryActionTypes.NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
}, 'activePage');
