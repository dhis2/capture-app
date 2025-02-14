// @flow
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
}

export async function cacheSystemSettings(
    uiLocale: string,
    systemSettings: { dateFormat: string, serverTimeZoneId: string, calendar: string, },
) {
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: systemSettings.dateFormat.toUpperCase(),
        },
        // This is a user setting, and both this and the dir property below should be placed somewhere else. Will do this in https://dhis2.atlassian.net/browse/DHIS2-19015.
        {
            id: 'uiLocale',
            value: uiLocale,
        },
        {
            id: 'dir',
            value: isLangRTL(uiLocale) ? 'rtl' : 'ltr',
        },
        {
            id: 'serverTimeZoneId',
            value: systemSettings.serverTimeZoneId,
        },
        {
            id: 'calendar',
            value: systemSettings.calendar !== 'julian' ? systemSettings.calendar : 'iso8601',
        },
    ];

    const storageController = getMainStorageController();
    await storageController.setAll(mainStores.SYSTEM_SETTINGS, systemSettingsArray);
    return systemSettingsArray;
}
