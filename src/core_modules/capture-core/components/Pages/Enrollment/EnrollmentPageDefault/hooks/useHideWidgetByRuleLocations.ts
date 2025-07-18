import { useMemo } from 'react';

export const useHideWidgetByRuleLocations = (programRules: any) => useMemo(() => {
    const ruleLocations = programRules.map((item: any) => item.programRuleActions
        .map((rule: any) => rule.location ?? null))
        .flat();

    const hideWidgets: any = {};
    hideWidgets.feedback = !ruleLocations.includes('feedback');
    hideWidgets.indicator = !ruleLocations.includes('indicators');

    return hideWidgets;
}, [programRules]);
