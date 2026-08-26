import { useMemo } from 'react';

export const useHideWidgetByRuleLocations = (programRules: any) => useMemo(() => {
    const ruleLocations = new Set(
        programRules.flatMap((item: any) =>
            item.programRuleActions.map((rule: any) => rule.location ?? null),
        ),
    );

    const hideWidgets: any = {};
    hideWidgets.feedback = !ruleLocations.has('feedback');
    hideWidgets.indicator = !ruleLocations.has('indicators');

    return hideWidgets;
}, [programRules]);
