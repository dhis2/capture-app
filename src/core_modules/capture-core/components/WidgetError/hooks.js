
export const useFilteredWidgetData = (rules) => {
    const showWarning = [];
    const showError = [];
    const displayKeyValuePairs = [];
    const displayText = [];

    rules && rules.forEach((rule) => {
        switch (rule.type) {
        case 'SHOWWARNING':
            showWarning.push(rule);
            break;
        case 'SHOWERROR':
            showError.push(rule);
            break;
        case 'DISPLAYKEYVALUEPAIRS':
            displayKeyValuePairs.push(rule);
            break;
        case 'DISPLAYTEXT':
            displayText.push(rule);
            break;
        default:
            break;
        }
    });

    return {
        showWarning,
        showError,
        displayKeyValuePairs,
        displayText,
    };
};
