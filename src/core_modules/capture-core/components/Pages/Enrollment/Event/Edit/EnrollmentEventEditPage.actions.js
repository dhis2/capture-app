// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const enrollmentEventEditPagePageActionTypes = {
    EVENT_START_FETCH: 'EnrollmentEventEditPage.FetchingEvent',
    EVENT_ERROR_FETCH: 'EnrollmentEventEditPage.ErrorOnFetching',
    EVENT_SUCCESS_FETCH: 'EnrollmentEventEditPage.SuccessOnFetching',
    EVENT_LOADING_FETCH: 'EnrollmentEventEditPage.LoadingOnFetching',
};

export const showLoadingViewOnEnrollmentEventEditPage = () =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_LOADING_FETCH)();

export const showErrorViewOnEnrollmentEventEditPage = ({ error }: { error: string }) =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_ERROR_FETCH)({ error });

export const fetchEventInformation = () =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_START_FETCH)();

export const successfulFetchingEventInformation = ({ ...args }: any) =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_SUCCESS_FETCH)({ ...args });
