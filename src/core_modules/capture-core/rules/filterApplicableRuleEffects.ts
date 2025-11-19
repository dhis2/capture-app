
export const filterApplicableRuleEffects = (rulesEffects: any = {}, effectAction: string) => {
    const { [effectAction]: _, ...filteredEffects } = rulesEffects;
    return filteredEffects;
};
