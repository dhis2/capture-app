// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/LockedSelector.actions';
import {
    actionTypes as viewEventActionTypes,
    actionTypes as viewEventPageActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../components/DataEntries/SingleEventRegistrationEntry';
import { actionTypes as viewEventDataEntryActionTypes } from '../../components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import { eventWorkingListsActionTypes } from '../../components/Pages/MainPage/EventWorkingLists';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';

export const activePageDesc = createReducerDescription({
    [lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_UPDATE]: state => ({
        ...state,
        isPageLoading: true,
    }),
    [lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID]: state => ({
        ...state,
        selectionsError: null,
        isPageLoading: false,
        isDataEntryLoading: false,
    }),
    [lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_INVALID]: (state, action) => ({
        ...state,
        isPageLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.FETCH_ORG_UNIT_ERROR]: (state, action) => ({
        ...state,
        isPageLoading: false,
        selectionsError: action.payload,
    }),
    [lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS]: state => ({
        ...state,
        isPageLoading: false,
    }),

    [viewEventPageActionTypes.VIEW_EVENT_FROM_URL]: state => ({
        ...state,
        isDataEntryLoading: true,
        isPageLoading: true,
        viewEventLoadError: null,
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

    [eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN]: state => ({
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
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_FETCH]: state => ({
        ...state,
        isPageLoading: true,
    }),
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH]: state => ({
        ...state,
        isPageLoading: false,
    }),
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH]: state => ({
        ...state,
        isPageLoading: false,
    }),

}, 'activePage', {
    selectionsError: null,
    isPageLoading: false,
    isDataEntryLoading: false,
    viewEventLoadError: null,
});
