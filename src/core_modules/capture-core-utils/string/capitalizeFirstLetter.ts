import i18n from '@dhis2/d2-i18n';

export function capitalizeFirstLetter(text: string) {
    if (!text) return text;
    const locale = (i18n as any).language ?? 'en';
    try {
        return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
    } catch {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
