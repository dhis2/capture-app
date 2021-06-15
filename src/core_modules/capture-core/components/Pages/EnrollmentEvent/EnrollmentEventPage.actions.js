// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentEventPageActionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY:
        'EnrollmentEventPage.StartShowEditEventDataEntryForViewSingleEvent',
    SHOW_EDIT_EVENT_DATA_ENTRY:
        'EnrollmentEventPage.ShowEditEventDataEntryForViewSingleEvent',
};

export const startShowEditEventDataEntry = () =>
    actionCreator(
        enrollmentEventPageActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY,
    )();

export const showEditEventDataEntry = () =>
    actionCreator(enrollmentEventPageActionTypes.SHOW_EDIT_EVENT_DATA_ENTRY)();
