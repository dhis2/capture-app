// @flow
import { ActionsObservable } from 'redux-observable';
import { updateEventListAfterSaveOrUpdateSingleEvent } from './mainPage.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../NewEvent';
import { actionTypes as editEventDataEntryActionTypes } from '../EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as viewEventEditEventDataEntryActionTypes } from '../ViewEvent/EventDetailsSection/EditEventDataEntry/editEventDataEntry.actions';
import { assigneeSectionActionTypes } from '../ViewEvent/RightColumn/AssigneeSection';
import isSelectionsEqual from '../../App/isSelectionsEqual';


const selectionsFilter = (state: ReduxState, action: Object) => {
    const isCurrentSelectionsComplete = state.currentSelections.complete;
    if (!isCurrentSelectionsComplete) {
        return false;
    }

    const savedSelectons = action.meta.selections;
    const currentSelections = state.currentSelections;
    return isSelectionsEqual(savedSelectons, currentSelections);
};

export const updateEventListAfterSaveOrUpdateEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$
        .ofType(
            newEventDataEntryActionTypes.NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE,
            editEventDataEntryActionTypes.EVENT_UPDATED_AFTER_RETURN_TO_MAIN_PAGE,
        )
        .filter((action) => {
            const state = store.getState();
            return selectionsFilter(state, action);
        })
        .map(() => updateEventListAfterSaveOrUpdateSingleEvent());

export const updateEventListAfterUpdateEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$
        .ofType(
            viewEventEditEventDataEntryActionTypes.EDIT_EVENT_DATA_ENTRY_SAVED,
            assigneeSectionActionTypes.VIEW_EVENT_ASSIGNEE_SAVE_COMPLETED,
        ).filter((action) => {
            const state = store.getState();
            const currentPageIsMainPage = state.app.page === null;
            return currentPageIsMainPage && selectionsFilter(state, action);
        })
        .map(() => updateEventListAfterSaveOrUpdateSingleEvent());
