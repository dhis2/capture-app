export const filterApplicableRuleEffects = (rulesEffects: Record<string, unknown> = {}, effectAction: string): Record<string, unknown> => {
    const { [effectAction]: _, ...filteredEffects } = rulesEffects;
    return filteredEffects;
}; 