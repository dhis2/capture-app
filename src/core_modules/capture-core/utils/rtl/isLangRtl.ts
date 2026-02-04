import { systemSettingsStore } from '../../metaDataMemoryStores/systemSettings/systemSettings.store';

export function isLangRtl(): boolean {
    return systemSettingsStore.get()?.dir === 'rtl';
}
