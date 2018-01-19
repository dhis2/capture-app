// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    START_COMPLETE_FORM: 'StartCompleteEventForm',
    COMPLETE_FORM: 'CompleteForm',
};

export const startCompleteForm = () => actionCreator(actionTypes.START_COMPLETE_FORM)();
export const completeForm = (values: Object) => actionCreator(actionTypes.COMPLETE_FORM)(values);
