// @flow
import { updateEventListAfterSaveOrUpdateSingleEvent } from './mainPage.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../NewEvent';
import { actionTypes as editEventDataEntryActionTypes } from '../EditEvent/DataEntry/editEventDataEntry.actions';
import isSelectionsEqual from '../../App/isSelectionsEqual';


export const updateEventListAfterSaveOrUpdateEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$
        .ofType(
            newEventDataEntryActionTypes.NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE,
            editEventDataEntryActionTypes.EVENT_UPDATED_AFTER_RETURN_TO_MAIN_PAGE,
        )
        .filter((action) => {
            const state = store.getState();

            const isCurrentSelectionsComplete = state.currentSelections.complete;
            if (!isCurrentSelectionsComplete) {
                return false;
            }

            const savedSelectons = action.meta.selections;
            const currentSelections = state.currentSelections;
            return isSelectionsEqual(savedSelectons, currentSelections);
        })
        .map(() => updateEventListAfterSaveOrUpdateSingleEvent());
