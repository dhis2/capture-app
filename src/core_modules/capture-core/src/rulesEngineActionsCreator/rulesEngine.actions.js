// @flow
import { actionCreator } from '../actions/actions.utils';

export const actionTypes = {
    UPDATE_RULES_EFFECTS_EVENT: 'UpdateRulesEffectsForEvent',
    UPDATE_FIELD_FROM_RULE_EFFECT: 'UpdateFieldFromRuleEffect',
};

export const updateRulesEffects = (rulesEffects: ?Object = {}, formId: string, eventId: string, dataEntryId: string) =>
    actionCreator(actionTypes.UPDATE_RULES_EFFECTS_EVENT)({ rulesEffects, formId, eventId, dataEntryId });

export const updateFieldFromRuleEffect = (value: any, elementId: string, formId: string) =>
    actionCreator(actionTypes.UPDATE_FIELD_FROM_RULE_EFFECT)({ value, elementId, formId });

