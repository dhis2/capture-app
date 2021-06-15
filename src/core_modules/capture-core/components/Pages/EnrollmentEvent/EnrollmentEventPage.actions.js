// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentEventPageActionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY:
        'EnrollmentEventPage.StartShowEditEventDataEntryForViewSingleEvent',
};

export const startShowEditEventDataEntry = () =>
    actionCreator(
        enrollmentEventPageActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY,
    )();
