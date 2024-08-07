import { useSelector } from 'react-redux';
import { isEqual } from 'lodash/lang';

export const useWidgetDataFromStore = (reducerName) => {
    const checkIfEqual = (oldValues, newValues) => isEqual(oldValues.feedbacks, newValues.feedbacks) &&
        isEqual(oldValues.indicators, newValues.indicators) &&
        isEqual(oldValues.warnings, newValues.warnings) &&
        isEqual(oldValues.errors, newValues.errors);

    return useSelector(({
        rulesEffectsFeedback,
        rulesEffectsIndicators,
        rulesEffectsGeneralWarnings,
        rulesEffectsGeneralErrors,
    }) => ({
        feedbacks: [
            ...rulesEffectsFeedback[reducerName]?.displayTexts || [],
            ...rulesEffectsFeedback[reducerName]?.displayKeyValuePairs || [],
        ],
        indicators: [
            ...rulesEffectsIndicators[reducerName]?.displayTexts || [],
            ...rulesEffectsIndicators[reducerName]?.displayKeyValuePairs || [],
        ],
        warnings: rulesEffectsGeneralWarnings[reducerName]?.warning,
        errors: rulesEffectsGeneralErrors[reducerName]?.error,
    }), checkIfEqual);
};
