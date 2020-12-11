// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
  CLOSE_FEEDBACK: 'CloseFeedback',
};

export const closeFeedback = () => actionCreator(actionTypes.CLOSE_FEEDBACK)();
