// @flow
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';

export const useWidgetDataFromStore = (reducerName: string) => useSelector(({
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
}), shallowEqual);
