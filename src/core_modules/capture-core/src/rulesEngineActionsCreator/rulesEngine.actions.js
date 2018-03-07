// @flow
import { actionCreator } from '../actions/actions.utils';

export const actionTypes = {
    UPDATE_RULES_EFFECTS: 'UpdateRulesEffects',
    NO_RULES_EFFECTS_UPDATE: 'NoRulesEffectsUpdate',
};

export const updateRulesEffects = (rulesEffects: ?Object = {}, formId: string, eventId: string, dataEntryId: string) =>
    actionCreator(actionTypes.UPDATE_RULES_EFFECTS)({ rulesEffects, formId, eventId, dataEntryId });