import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';

type I18nInternal = {
    getResource: (lang: string, ns: string, key: string) => string | undefined;
    language: string;
};
const internal = i18n as unknown as I18nInternal;

const getTranslatedTemplate = (key: string): string =>
    internal.getResource(internal.language, 'default', key)
    ?? internal.getResource('en', 'default', key)
    ?? key;

type Options = {
    interpolation?: Record<string, unknown>;
    [key: string]: unknown;
};

export const customTerms = {
    i18n: {
        t: (key: string, options: Options = {}): string => {
            const { interpolation, ...values } = options;
            const template = getTranslatedTemplate(key).trimStart();

            const casedValues = Object.fromEntries(
                Object.entries(values).map(([name, value]) => {
                    const variableIsAtSentenceStart = template.startsWith(`{{${name}}}`)
                        || template.startsWith(`{{${name},`);
                    const shouldCapitalize = typeof value === 'string' && variableIsAtSentenceStart;
                    return [name, shouldCapitalize ? capitalizeFirstLetter(value) : value];
                }),
            );

            return i18n.t(key, {
                ...casedValues,
                interpolation: { escapeValue: false, ...interpolation },
            });
        },
    },
};
