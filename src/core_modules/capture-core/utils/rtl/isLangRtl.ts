import { systemSettingsStore } from '../../metaDataMemoryStores';

export function isLangRtl(code?: string): boolean {
    const locale = code || systemSettingsStore.get()?.uiLocale || 'en';
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(locale) || prefixed.filter(c => locale.startsWith(c)).length > 0;
}
