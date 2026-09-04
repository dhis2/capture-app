import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getEnrollmentScopeFormId } from '../../../common/EnrollmentOverviewDomain';

export const useFilteredWidgetData = (enrollmentId?: string) => {
    const formId = enrollmentId ? getEnrollmentScopeFormId(enrollmentId) : undefined;

    const generalErrors = useSelector(({ rulesEffectsGeneralErrors }: any) =>
        (formId ? rulesEffectsGeneralErrors?.[formId] : undefined));
    const generalWarnings = useSelector(({ rulesEffectsGeneralWarnings }: any) =>
        (formId ? rulesEffectsGeneralWarnings?.[formId] : undefined));
    const feedback = useSelector(({ rulesEffectsFeedback }: any) =>
        (formId ? rulesEffectsFeedback?.[formId] : undefined));
    const indicators = useSelector(({ rulesEffectsIndicators }: any) =>
        (formId ? rulesEffectsIndicators?.[formId] : undefined));

    return useMemo(() => ({
        warnings: generalWarnings?.warning ?? [],
        errors: generalErrors?.error ?? [],
        feedbacks: [
            ...(feedback?.displayTexts ?? []),
            ...(feedback?.displayKeyValuePairs ?? []),
        ],
        indicators: [
            ...(indicators?.displayTexts ?? []),
            ...(indicators?.displayKeyValuePairs ?? []),
        ],
    }), [generalErrors, generalWarnings, feedback, indicators]);
};
