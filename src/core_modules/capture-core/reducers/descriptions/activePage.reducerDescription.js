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
    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: state => ({
        ...state,
        isPageContentLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE]: state => ({
        ...state,
        isLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_VALID]: state => ({
        ...state,
        selectionsError: null,
        isLoading: false,
        isPageContentLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_INVALID]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_ERROR_RETRIEVING]: (state, action) => ({
        ...state,
        isLoading: false,
        selectionsError: action.payload,
    }),

    [viewEventPageActionTypes.VIEW_EVENT_FROM_URL]: state => ({
        ...state,
        isPageContentLoading: true,
        isLoading: true,
    }),
    [viewEventDataEntryActionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        isPageContentLoading: false,
        viewEventLoadError: action.payload,
    }),
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: state => ({
        ...state,
        isPageContentLoading: false,
    }),
    [eventListActionTypes.OPEN_VIEW_EVENT_PAGE]: state => ({
        ...state,
        isPageContentLoading: true,
    }),
    [viewEventPageActionTypes.OPEN_VIEW_EVENT_PAGE_FAILED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload.error,
    }),
    [viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: state => ({
        ...state,
        isPageContentLoading: true,
        isLoading: false,
    }),
    [viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE]: state => ({
        ...state,
        isPageContentLoading: true,
        isLoading: false,
    }),
    [viewEventPageActionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload,
        isLoading: false,
    }),

    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: state => ({
        ...state,
        isPageContentLoading: false,
    }),
    [newEventDataEntryActionTypes.NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL]: state => ({
        ...state,
        isPageContentLoading: false,
    }),
}, 'activePage');
