import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';

const getRawTranslation = (key: string): string =>
    (i18n as any).getResource((i18n as any).language, 'default', key)
    ?? (i18n as any).getResource('en', 'default', key)
    ?? key;

const startsWithVar = (raw: string, varName: string): boolean => {
    const trimmed = raw.trimStart();
    return trimmed.startsWith(`{{${varName}}}`) || trimmed.startsWith(`{{${varName},`);
};

/**
 * Drop-in replacement for i18n.t() when the string contains custom label variables.
 * Automatically capitalizes a variable's value when it appears as the first word
 * in the translated string — without requiring any changes to translation files.
 */
export const tLabel = (key: string, options: Record<string, unknown> = {}): string => {
    const raw = getRawTranslation(key);
    const processedOptions = { ...options };

    for (const [varName, value] of Object.entries(options)) {
        if (typeof value === 'string' && startsWithVar(raw, varName)) {
            processedOptions[varName] = capitalizeFirstLetter(value);
        }
    }

    return i18n.t(key, { ...processedOptions, interpolation: { escapeValue: false } });
};
