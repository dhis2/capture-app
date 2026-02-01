import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';

const RTL_LOCALES = ['ar', 'ar_EG', 'ar_IQ', 'ar_SD', 'ckb', 'ps', 'prs', 'ur'];

export function isLangRtl(code?: string): boolean {
    const locale = code || systemSettingsStore.get()?.uiLocale || 'en';
    const prefixed = RTL_LOCALES.map(c => `${c}-`);
    return RTL_LOCALES.includes(locale) || prefixed.some(c => locale.startsWith(c));
}
