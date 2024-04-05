// @flow

export const filterApplicableRuleEffects = (rulesEffects: ?Object = {}, effectAction: string): ?Object => {
    if (!rulesEffects) {
        return rulesEffects;
    }
    const { [effectAction]: _, ...filteredEffects } = rulesEffects;
    return filteredEffects;
};
