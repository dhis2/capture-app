// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

type rulesProps = {
    type: string,
    id: string,
    error?: { id: string, message: string },
    warning?: { id: string, message: string },
    displayText?: { id: string, message: string },
    displayKeyValuePair?: { id: string, key: string, value: string }
}

export const useEnrollmentInfo = (enrollmentId: string, programId: string) => {
    const enrollments = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const tetId = useSelector(({ enrollmentPage }) => enrollmentPage.tetId);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .filter(({ program }) => program === programId)
        .some(({ enrollment }) => enrollmentId === enrollment);

    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId };
};

export const useFilteredWidgetData = (rules: Array<rulesProps>) => useMemo(() => {
    let showWarning = [];
    let showError = [];
    let feedback = [];
    let indicator = [];

    const ruleTypes = Object.freeze({
        SHOWWARNING: 'SHOWWARNING',
        SHOWERROR: 'SHOWERROR',
        DISPLAYKEYVALUEPAIRS: 'DISPLAYKEYVALUEPAIRS',
        DISPLAYTEXT: 'DISPLAYTEXT',
    });

    const ruleIDs = Object.freeze({
        general: 'general',
        feedback: 'feedback',
        indicators: 'indicators',
    });

    rules && rules.forEach((rule) => {
        if (rule.id === ruleIDs.general) {
            switch (rule.type) {
            case ruleTypes.SHOWWARNING:
                showWarning = [...showWarning, rule.warning];
                break;
            case ruleTypes.SHOWERROR:
                showError = [...showError, rule.error];
                break;
            default:
                break;
            }
        } else if (rule.id === ruleIDs.feedback) {
            feedback = [...feedback, rule?.displayText || rule?.displayKeyValuePair];
        } else if (rule.id === ruleIDs.indicators) {
            indicator = [...indicator, rule?.displayText || rule?.displayKeyValuePair];
        }
    });

    return {
        showWarning,
        showError,
        feedback,
        indicator,
    };
}, [rules]);
