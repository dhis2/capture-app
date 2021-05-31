// @flow

type rulesProps = {
    type: string,
    id: string,
}

export const useFilteredWidgetData = (rules: Array<rulesProps>) => {
    const showWarning = [];
    const showError = [];
    const feedbackKeyValuePairs = [];
    const feedbackDisplayText = [];
    const indicatorKeyValue = [];
    const indicatorDisplayText = [];

    rules && rules.forEach((rule) => {
        if (rule.id === 'general') {
            switch (rule.type) {
            case 'SHOWWARNING':
                showWarning.push(rule);
                break;
            case 'SHOWERROR':
                showError.push(rule);
                break;
            default:
                break;
            }
        } else if (rule.id === 'feedback') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                feedbackKeyValuePairs.push(rule);
                break;
            case 'DISPLAYTEXT':
                feedbackDisplayText.push(rule);
                break;
            default:
                break;
            }
        } else if (rule.id === 'indicators') {
            switch (rule.type) {
            case 'DISPLAYKEYVALUEPAIRS':
                indicatorKeyValue.push(rule);
                break;
            case 'DISPLAYTEXT':
                indicatorDisplayText.push(rule);
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
};
