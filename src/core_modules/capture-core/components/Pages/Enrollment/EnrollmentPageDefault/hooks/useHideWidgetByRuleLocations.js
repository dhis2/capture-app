import { useMemo } from 'react';

export const useHideWidgetByRuleLocations = programRules => useMemo(() => {
    const ruleLocations = programRules.map(item => item.programRuleActions
        .map(rule => rule.location || null))
        .flat();

    const hideWidgets = {};
    hideWidgets.feedback = !ruleLocations.includes('feedback');
    hideWidgets.indicator = !ruleLocations.includes('indicators');

    return hideWidgets;
}, [programRules]);
