// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/LockedSelector.actions';
import {
    actionTypes as viewEventActionTypes,
    actionTypes as viewEventPageActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../components/Pages/NewEvent';
import { actionTypes as viewEventDataEntryActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import { actionTypes as eventListActionTypes } from '../../components/Pages/MainPage/EventsList';

export const activePageDesc = createReducerDescription({
    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: state => ({
        ...state,
        isDataEntryLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE]: state => ({
        ...state,
        isPageLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_VALID]: state => ({
        ...state,
        selectionsError: null,
        isPageLoading: false,
        isDataEntryLoading: true,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_INVALID]: (state, action) => ({
        ...state,
        isPageLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_ERROR_RETRIEVING]: (state, action) => ({
        ...state,
        isPageLoading: false,
        selectionsError: action.payload,
    }),

    [viewEventPageActionTypes.VIEW_EVENT_FROM_URL]: state => ({
        ...state,
        isDataEntryLoading: true,
        isPageLoading: true,
    }),
    [viewEventDataEntryActionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY]: (state, action) => ({
        ...state,
        isDataEntryLoading: false,
        viewEventLoadError: action.payload,
    }),
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: state => ({
        ...state,
        isDataEntryLoading: false,
    }),
    [eventListActionTypes.OPEN_VIEW_EVENT_PAGE]: state => ({
        ...state,
        isDataEntryLoading: true,
    }),
    [viewEventPageActionTypes.OPEN_VIEW_EVENT_PAGE_FAILED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload.error,
    }),
    [viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: state => ({
        ...state,
        isDataEntryLoading: true,
        isPageLoading: false,
    }),
    [viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE]: state => ({
        ...state,
        isDataEntryLoading: true,
        isPageLoading: false,
    }),
    [viewEventPageActionTypes.EVENT_FROM_URL_COULD_NOT_BE_RETRIEVED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload,
        isPageLoading: false,
    }),

    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: state => ({
        ...state,
        isDataEntryLoading: false,
    }),
    [newEventDataEntryActionTypes.NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL]: state => ({
        ...state,
        isDataEntryLoading: false,
    }),
}, 'activePage');
