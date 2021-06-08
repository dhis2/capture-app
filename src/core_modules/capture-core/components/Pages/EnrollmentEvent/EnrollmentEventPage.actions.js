// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentEventPageActionTypes = {
    ADD_EVENT: 'EnrollmentEventPage.AddEvent',
};

export const addEvent = ({ event }) =>
    actionCreator(enrollmentEventPageActionTypes.ADD_EVENT)({ event });
