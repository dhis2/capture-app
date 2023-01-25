// @flow
import { actionCreator } from '../actions/actions.utils';

export const rulesEffectsActionTypes = {
    UPDATE_RULES_EFFECTS: 'UpdateRulesEffects',
};

export const updateRulesEffects = (rulesEffects: ?Object = {}, formId: string) =>
    actionCreator(rulesEffectsActionTypes.UPDATE_RULES_EFFECTS)({ rulesEffects, formId });
