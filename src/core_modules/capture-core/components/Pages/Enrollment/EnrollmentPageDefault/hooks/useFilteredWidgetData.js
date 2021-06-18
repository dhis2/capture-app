// @flow
import { useMemo } from 'react';

type rulesProps = {
    type: string,
    id: string,
    error?: { id: string, message: string },
    warning?: { id: string, message: string },
    displayText?: { id: string, message: string },
    displayKeyValuePair?: { id: string, key: string, value: string }
}

export const useFilteredWidgetData = (rulesEffects: ?Array<rulesProps>) => useMemo(() => {
    let warnings = [];
    let errors = [];
    let feedbacks = [];
    let indicators = [];

    const effectTypes = Object.freeze({
        SHOWWARNING: 'SHOWWARNING',
        SHOWERROR: 'SHOWERROR',
        DISPLAYKEYVALUEPAIRS: 'DISPLAYKEYVALUEPAIRS',
        DISPLAYTEXT: 'DISPLAYTEXT',
    });

    const effectIDs = Object.freeze({
        general: 'general',
        feedback: 'feedback',
        indicators: 'indicators',
    });

    rulesEffects?.forEach((effect) => {
        if (effect.id === effectIDs.general) {
            switch (effect.type) {
            case effectTypes.SHOWWARNING:
                warnings = [...warnings, effect.warning];
                break;
            case effectTypes.SHOWERROR:
                errors = [...errors, effect.error];
                break;
            default:
                break;
            }
        } else if (effect.id === effectIDs.feedback) {
            feedbacks = [...feedbacks, effect?.displayText || effect?.displayKeyValuePair];
        } else if (effect.id === effectIDs.indicators) {
            indicators = [...indicators, effect?.displayText || effect?.displayKeyValuePair];
        }
    });

    return {
        warnings,
        errors,
        feedbacks,
        indicators,
    };
}, [rulesEffects]);
