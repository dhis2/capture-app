import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    CLOSE_FEEDBACK: 'CloseFeedback',
} as const;

export const closeFeedback = () => actionCreator(actionTypes.CLOSE_FEEDBACK)();
