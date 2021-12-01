// @flow
import { getD2 } from '../../d2';
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
}

export async function cacheSystemSettings(uiLocale: string) {
    const d2 = getD2();
    const d2SystemInfo = d2.system.systemInfo;
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: d2SystemInfo.dateFormat.toUpperCase(),
        },
        {
            id: 'dir',
            value: isLangRTL(uiLocale) ? 'rtl' : 'ltr',
        },
    ];

    const storageController = getMainStorageController();
    await storageController.setAll(mainStores.SYSTEM_SETTINGS, systemSettingsArray);
    return systemSettingsArray;
}
