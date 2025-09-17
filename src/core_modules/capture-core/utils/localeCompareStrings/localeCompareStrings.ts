import i18n from '@dhis2/d2-i18n';

export const localeCompareStrings = (a: string, b: string) => {
    try {
        return a.localeCompare(b, (i18n as any).language);
    } catch {
        return a.localeCompare(b, 'en');
    }
};
