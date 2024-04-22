// @flow

export const filterApplicableRuleEffects = (rulesEffects: Object = {}, effectAction: string) => {
    const { [effectAction]: _, ...filteredEffects } = rulesEffects;
    return filteredEffects;
};
