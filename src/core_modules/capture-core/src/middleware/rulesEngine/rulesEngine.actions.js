// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    UPDATE_RULES_EFFECTS: 'UpdateRulesEffects',
};

export const updateRulesEffects = (rulesEffects: Object, formId: string) =>
    actionCreator(actionTypes.UPDATE_RULES_EFFECTS)({ rulesEffects, formId });

