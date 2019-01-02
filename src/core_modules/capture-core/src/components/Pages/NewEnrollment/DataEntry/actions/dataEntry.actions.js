// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewEnrollment',
};

export const startRunRulesOnUpdateForNewEnrollment = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);
