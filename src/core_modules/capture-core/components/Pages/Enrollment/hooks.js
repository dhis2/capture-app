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

    rules && rules.forEach((rule) => {
        if (rule.id === 'general') {
            switch (rule.type) {
            case 'SHOWWARNING':
                showWarning = [...showWarning, rule.warning];
                break;
            case 'SHOWERROR':
                showError = [...showError, rule.error];
                break;
            default:
                break;
            }
        } else if (rule.id === 'feedback') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                feedbackKeyValuePairs = [...feedbackKeyValuePairs, rule.displayKeyValuePair];
                break;
            case 'DISPLAYTEXT':
                feedbackDisplayText = [...feedbackDisplayText, rule.displayText];
                break;
            default:
                break;
            }
        } else if (rule.id === 'indicators') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                indicatorKeyValue = [...indicatorKeyValue, rule.displayKeyValuePair];
                break;
            case 'DISPLAYTEXT':
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
