// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const addEnrollmentEventPageActionTypes = {
    EVENT_SAVE: 'NewEnrollmentEventPage.saveEvent',
    EVENT_SAVE_SUCCESS: 'NewEnrollmentEventPage.saveEventSuccess',
    EVENT_SAVE_CANCEL: 'NewEnrollmentEventPage.cancelSaveEvent',
};

export const cancelSaveEvent = () => actionCreator(addEnrollmentEventPageActionTypes.EVENT_SAVE_CANCEL)();
