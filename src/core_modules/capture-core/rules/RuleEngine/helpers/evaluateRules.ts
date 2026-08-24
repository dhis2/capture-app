import {
    RuleEngineJs,
    RuleEnrollmentJs,
    RuleEventJs,
    RuleEngineContextJs,
} from '@dhis2/rule-engine';

export const evaluateRules = ({
    ruleEngine,
    enrollment,
    currentEvent,
    events,
    executionContext,
    isFirstStageEventForm,
}: {
    ruleEngine: RuleEngineJs
    enrollment: RuleEnrollmentJs | null,
    currentEvent: RuleEventJs | null | undefined,
    events: Array<RuleEventJs>,
    executionContext: RuleEngineContextJs,
    isFirstStageEventForm: boolean | undefined,
}) => {
    if (!currentEvent) {
        return ruleEngine.evaluateEnrollment(
            enrollment!,
            events,
            executionContext,
        );
    }
    if (!isFirstStageEventForm) {
        return ruleEngine.evaluateEvent(
            currentEvent,
            enrollment,
            events,
            executionContext,
        );
    }
    const duplicateActionIds = new Set<string>();
    return ruleEngine.evaluateAll(enrollment, [currentEvent], executionContext)
        .flatMap(entry => entry.ruleEffects)
        .filter((effect) => {
            const actionId = effect.ruleAction.values.get('id');
            if (!actionId) {
                return true;
            }
            if (duplicateActionIds.has(actionId)) {
                return false;
            }
            duplicateActionIds.add(actionId);
            return true;
        });
};
