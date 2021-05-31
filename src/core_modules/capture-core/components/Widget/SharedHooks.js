// @flow
import { useMemo } from 'react';

type rulesProps = {
    type: string,
    id: string,
}

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
                showWarning = [...showWarning, rule];
                break;
            case 'SHOWERROR':
                showError = [...showError, rule];
                break;
            default:
                break;
            }
        } else if (rule.id === 'feedback') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                feedbackKeyValuePairs = [...feedbackKeyValuePairs, rule];
                break;
            case 'DISPLAYTEXT':
                feedbackDisplayText = [...feedbackDisplayText, rule];
                break;
            default:
                break;
            }
        } else if (rule.id === 'indicators') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                indicatorKeyValue = [...indicatorKeyValue, rule];
                break;
            case 'DISPLAYTEXT':
                indicatorDisplayText = [...indicatorDisplayText, rule];
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
