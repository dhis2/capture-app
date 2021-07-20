// @flow
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';

export const useWidgetDataFromStore = () => useSelector(({
    rulesEffectsFeedback,
    rulesEffectsIndicators,
    rulesEffectsGeneralWarnings,
    rulesEffectsGeneralErrors,
}) => ({
    feedbacks: [
        ...rulesEffectsFeedback['singleEvent-newEvent']?.displayTexts || [],
        ...rulesEffectsFeedback['singleEvent-newEvent']?.displayKeyValuePairs || [],
    ],
    indicators: [
        ...rulesEffectsIndicators['singleEvent-newEvent']?.displayTexts || [],
        ...rulesEffectsIndicators['singleEvent-newEvent']?.displayKeyValuePairs || [],
    ],
    errors: rulesEffectsGeneralWarnings['singleEvent-newEvent']?.warning,
    warnings: rulesEffectsGeneralErrors['singleEvent-newEvent']?.error,
}), shallowEqual);
