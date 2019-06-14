// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    START_ENROLLMENT_LOAD: 'StartEnrollmentLoad',
    ENROLLMENT_LOADED: 'EnrollmentLoaded',
    ENROLLMENT_LOAD_FAILED: 'EnrollmentLoadFailed',
};

export const startEnrollmentLoad = () => actionCreator(actionTypes.START_ENROLLMENT_LOAD)();
export const enrollmentLoaded = (events: any) => actionCreator(actionTypes.ENROLLMENT_LOADED)(events);
export const enrollmentLoadFailed = (message: string) => actionCreator(actionTypes.ENROLLMENT_LOAD_FAILED)(message);
