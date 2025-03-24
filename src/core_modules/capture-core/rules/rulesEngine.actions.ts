import { actionCreator } from '../actions/actions.utils';

export const rulesEffectsActionTypes = {
    UPDATE_RULES_EFFECTS: 'UpdateRulesEffects',
};

export const updateRulesEffects = (rulesEffects: Record<string, unknown> | null = {}, formId: string) =>
    actionCreator(rulesEffectsActionTypes.UPDATE_RULES_EFFECTS)({ rulesEffects, formId }); 