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
    let feedbackKeyValuePairs = [];
    let feedbackDisplayText = [];
    let indicatorKeyValue = [];
    let indicatorDisplayText = [];

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
            switch (rule.type) {
            case ruleTypes.DISPLAYKEYVALUEPAIRS:
                feedbackKeyValuePairs = [...feedbackKeyValuePairs, rule.displayKeyValuePair];
                break;
            case ruleTypes.DISPLAYTEXT:
                feedbackDisplayText = [...feedbackDisplayText, rule.displayText];
                break;
            default:
                break;
            }
        } else if (rule.id === ruleIDs.indicators) {
            switch (rule.type) {
            case ruleTypes.DISPLAYKEYVALUEPAIRS:
                indicatorKeyValue = [...indicatorKeyValue, rule.displayKeyValuePair];
                break;
            case ruleTypes.DISPLAYTEXT:
                indicatorDisplayText = [...indicatorDisplayText, rule.displayText];
                break;
            default:
                break;
            }
        }
    });

    return {
        showWarning,
        showError,
        feedbackKeyValuePairs,
        feedbackDisplayText,
        indicatorDisplayText,
        indicatorKeyValue,
    };
}, [rules]);
