// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    START_ENROLLMENT_LOAD: 'StartEnrollmentLoad',
    ENROLLMENT_LOADED: 'EnrollmentLoaded',
};

export const startEnrollmentLoad = () => actionCreator(actionTypes.START_ENROLLMENT_LOAD)();
export const enrollmentLoaded = events => actionCreator(actionTypes.ENROLLMENT_LOADED)(events);
