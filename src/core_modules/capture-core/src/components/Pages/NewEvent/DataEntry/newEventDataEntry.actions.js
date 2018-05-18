// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    START_RUN_RULES: 'StartRunRulesForNewSingleEvent',
    RUN_RULES: 'RunRulesForNewSingleEvent',
};

export const startRunRulesForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES)(actionData);
