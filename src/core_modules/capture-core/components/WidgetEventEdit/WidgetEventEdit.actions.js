// @flow
import { actionCreator } from '../../actions/actions.utils';

export const enrollmentEventPageActionTypes = {
    EVENT_FROM_URL_RETRIEVED: 'EnrollmentEventPage.AddEvent',
};

export const eventFromUrlRetrieved = (eventContainer: Object) =>
    actionCreator(enrollmentEventPageActionTypes.EVENT_FROM_URL_RETRIEVED)({
        eventContainer,
    });
