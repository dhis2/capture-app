// @flow
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
}

export async function cacheSystemSettings(
    systemSettings: { dateFormat: string, serverTimeZoneId: string, calendar: string, baseUrl: string},
    userSettings: { uiLocale: string, captureScope: Array<{id: string}>, searchScope: Array<{id: string}> },
) {
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: systemSettings.dateFormat.toUpperCase(),
        },
        {
            id: 'serverTimeZoneId',
            value: systemSettings.serverTimeZoneId,
        },
        {
            id: 'calendar',
            value: systemSettings.calendar !== 'julian' ? systemSettings.calendar : 'iso8601',
        },
        // These are user settings and should be placed somewhere else. Will do this in https://dhis2.atlassian.net/browse/DHIS2-19015.
        {
            id: 'uiLocale',
            value: userSettings.uiLocale,
        },
        {
            id: 'dir',
            value: isLangRTL(userSettings.uiLocale) ? 'rtl' : 'ltr',
        },
        {
            id: 'captureScope',
            // $FlowFixMe
            value: userSettings.captureScope.map(orgUnit => orgUnit.id),
        },
        {
            id: 'searchScope',
            // $FlowFixMe
            value: userSettings.searchScope.map(orgUnit => orgUnit.id),
        },
        {
            id: 'baseUrl',
            value: systemSettings.baseUrl,
        },
    ];

    const storageController = getMainStorageController();
    await storageController.setAll(mainStores.SYSTEM_SETTINGS, systemSettingsArray);
    return systemSettingsArray;
}
