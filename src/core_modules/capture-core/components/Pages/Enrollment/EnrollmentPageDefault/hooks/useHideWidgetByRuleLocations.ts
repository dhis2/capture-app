import { useMemo } from 'react';

type ProgramRules = {
    programRuleActions: Array<any>,
};

interface HideWidgets {
    feedback?: boolean,
    indicator?: boolean,
}

export const useHideWidgetByRuleLocations = (programRules: ProgramRules[]) => useMemo(() => {
    const ruleLocations = programRules.map(item => item.programRuleActions.map(rule => rule.location || null)).flat();
    const hideWidgets: HideWidgets = {};
    hideWidgets.feedback = !ruleLocations.includes('feedback');
    hideWidgets.indicator = !ruleLocations.includes('indicators');
    return hideWidgets;
}, [programRules]);
