// @flow
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
}

export async function cacheSystemSettings(uiLocale: string, systemSettings: Object) {
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: systemSettings.keyDateFormat.toUpperCase(),
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
