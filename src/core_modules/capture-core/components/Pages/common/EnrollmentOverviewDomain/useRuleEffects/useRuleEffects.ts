import { useEffect, useState } from 'react';
import { getApplicableRuleEffectsForTrackerProgram } from '../../../../../rules';
import { useAttributeValuesForRules, useEnrollmentData, useEventsData } from './rulesExecutionData';
import type { UseRuleEffectsInput } from './useRuleEffects.types';

export const useRuleEffects = ({ orgUnit, program, apiEnrollment, apiAttributeValues }: UseRuleEffectsInput) => {
    const [ruleEffects, setRuleEffects] = useState<any>(undefined);
    const attributeValues = useAttributeValuesForRules(program, apiAttributeValues);
    const enrollmentData = useEnrollmentData(apiEnrollment);
    const otherEvents = useEventsData(apiEnrollment, program);

    useEffect(() => {
        if (orgUnit && attributeValues && enrollmentData && otherEvents) {
            const effects = getApplicableRuleEffectsForTrackerProgram({
                program,
                orgUnit,
                otherEvents,
                attributeValues,
                enrollmentData,
            }, true);
            if (Array.isArray(effects)) {
                setRuleEffects(effects);
            }
        }
    }, [attributeValues, enrollmentData, orgUnit, otherEvents, program]);

    return ruleEffects;
};
