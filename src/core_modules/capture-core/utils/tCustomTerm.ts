import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

type I18nInternal = {
    getResource: (lang: string, ns: string, key: string) => string | undefined;
    language: string;
};
const internal = i18n as unknown as I18nInternal;

const getRawTranslation = (key: string): string =>
    internal.getResource(internal.language, 'default', key)
    ?? internal.getResource('en', 'default', key)
    ?? key;

const startsWithVar = (raw: string, varName: string): boolean => {
    const trimmed = raw.trimStart();
    return trimmed.startsWith(`{{${varName}}}`) || trimmed.startsWith(`{{${varName},`);
};

export const tCustomTerm = (key: string, options: Record<string, unknown> = {}): string => {
    const raw = getRawTranslation(key);
    const { interpolation, ...values } = options;

    const cased = Object.fromEntries(
        Object.entries(values).map(([name, value]) => [
            name,
            typeof value === 'string' && startsWithVar(raw, name)
                ? capitalizeFirstLetter(value)
                : value,
        ]),
    );

    return i18n.t(key, {
        ...cased,
        interpolation: { escapeValue: false, ...(interpolation as Record<string, unknown> ?? {}) },
    });
};
