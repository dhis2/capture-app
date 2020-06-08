// @flow
import { createReducerDescription } from '../../trackerRedux';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/actions';
import {
    actionTypes as viewEventPageActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../components/Pages/NewEvent';

export const searchPageDesc = createReducerDescription({
    [lockedSelectorActionTypes.SET_ORG_UNIT]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
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

    [viewEventPageActionTypes.OPEN_VIEW_EVENT_PAGE_FAILED]: (state, action) => ({
        ...state,
        viewEventLoadError: action.payload.error,
    }),
    [viewEventPageActionTypes.VIEW_EVENT_FROM_URL]: state => ({
        ...state,
        isLoading: true,
    }),
    [viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: state => ({
        ...state,
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
