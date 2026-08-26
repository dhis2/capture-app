import { shallowEqual, useSelector } from 'react-redux';

export const useWidgetDataFromStore = (reducerName: string) => useSelector((state: any) => ({
    feedbacks: [
        ...state.rulesEffectsFeedback[reducerName]?.displayTexts || [],
        ...state.rulesEffectsFeedback[reducerName]?.displayKeyValuePairs || [],
    ],
    indicators: [
        ...state.rulesEffectsIndicators[reducerName]?.displayTexts || [],
        ...state.rulesEffectsIndicators[reducerName]?.displayKeyValuePairs || [],
    ],
    warnings: state.rulesEffectsGeneralWarnings[reducerName]?.warning,
    errors: state.rulesEffectsGeneralErrors[reducerName]?.error,
}), shallowEqual);
