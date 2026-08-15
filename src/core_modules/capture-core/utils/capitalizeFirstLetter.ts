import i18n from '@dhis2/d2-i18n';

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    const locale = (i18n as any).language ?? 'en';
    try {
        return str.charAt(0).toLocaleUpperCase(locale) + str.slice(1);
    } catch {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};
