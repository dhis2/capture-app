// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { environments } from 'capture-core/constants/environments';
import moment from 'moment';
import { CurrentLocaleData } from 'capture-core/utils/localeData/CurrentLocaleData';
import i18n from '@dhis2/d2-i18n';
import type { LocaleDataType } from 'capture-core/utils/localeData/CurrentLocaleData';

import { loadMetaData, cacheSystemSettings } from 'capture-core/metaDataStoreLoaders';
import { buildMetaDataAsync, buildSystemSettingsAsync } from 'capture-core/metaDataMemoryStoreBuilders';
import { initControllersAsync } from 'capture-core/storageControllers';
import { DisplayException } from 'capture-core/utils/exceptions';
import { rulesEngine } from '../../core_modules/capture-core/rules/rulesEngine';

function setLogLevel() {
    const levels = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };

    let level = levels[process.env.NODE_ENV];
    if (!level && level !== 0) {
        level = log.levels.ERROR;
    }

    log.setLevel(level);
}

function setMomentLocaleAsync(locale: string) {
    if (locale === 'en') {
        moment.locale(locale);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        // $FlowFixMe[unsupported-syntax] automated comment
        import(`moment/locale/${locale}`)
            .then(() => {
                moment.locale(locale);
                log.info(`got moment locale config for ${locale}`);
                resolve();
            })
            .catch(() => {
                // fallback to english
                moment.locale('en');
                log.error(`could not get moment locale config for ${locale}`);
                resolve();
            });
    });
}

function setDateFnLocaleAsync(locale: string, weekdays: any, weekdaysShort: any, firstDayOfWeek: number) {
    return new Promise((resolve, reject) => {
        // $FlowFixMe[unsupported-syntax] automated comment
        import(`date-fns/locale/${locale}/index.js`)
            .then((dateFnLocale) => {
                const localeData: LocaleDataType = {
                    dateFnsLocale: dateFnLocale,
                    weekDays: weekdays,
                    weekDaysShort: weekdaysShort,
                    calendarFormatHeaderLong: 'dddd D MMM',
                    calendarFormatHeaderShort: 'D MMM',
                    selectDatesText: i18n.t('Choose one or more dates...'),
                    selectDateText: i18n.t('Choose a date...'),
                    todayLabelShort: i18n.t('Today'),
                    todayLabelLong: i18n.t('Today'),
                    weekStartsOn: firstDayOfWeek,
                };

                log.info(`got date-fns locale for ${locale}`);
                CurrentLocaleData.set(localeData);
                resolve();
            }).catch(() => {
                log.error(`could not get date-fns locale config for ${locale}, fallback to en`);

                import('date-fns/locale/en/index.js') // eslint-disable-line
                    .then((dateFnLocale) => {
                        const localeData: LocaleDataType = {
                            dateFnsLocale: dateFnLocale,
                            weekDays: weekdays,
                            weekDaysShort: weekdaysShort,
                            calendarFormatHeaderLong: 'dddd D MMM',
                            calendarFormatHeaderShort: 'D MMM',
                            selectDatesText: i18n.t('Choose one or more dates...'),
                            selectDateText: i18n.t('Choose a date...'),
                            todayLabelShort: i18n.t('Today'),
                            todayLabelLong: i18n.t('Today'),
                            weekStartsOn: firstDayOfWeek,
                        };

                        CurrentLocaleData.set(localeData);
                        resolve();
                    })
                    .catch(() => {
                        log.error(`could not get the fallback date-fns locale for ${locale}`);
                        reject();
                    });
            });
    });
}

function changeI18nLocale(locale) {
    i18n.changeLanguage(locale);
}

function initI18n(locale) {
    changeI18nLocale(locale);
    i18n.setDefaultNamespace('default');
}

async function setLocaleDataAsync(uiLocale: string) { //eslint-disable-line
    const locale = uiLocale;
    await setMomentLocaleAsync(locale);
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();

    // $FlowFixMe[prop-missing] automated comment
    const firstDayOfWeek = moment.localeData()._week.dow; //eslint-disable-line

    await setDateFnLocaleAsync(locale, weekdays, weekdaysShort, firstDayOfWeek);
    initI18n(locale);
}

async function initializeMetaDataAsync(dbLocale: string, onQueryApi: Function, minorServerVersion: number) {
    await loadMetaData(onQueryApi);
    await buildMetaDataAsync(dbLocale, minorServerVersion);
}

async function initializeSystemSettingsAsync(
    uiLocale: string,
    systemSettings: { dateFormat: string, serverTimeZoneId: string },
) {
    const systemSettingsCacheData = await cacheSystemSettings(uiLocale, systemSettings);
    await buildSystemSettingsAsync(systemSettingsCacheData);
}

export async function initializeAsync(
    onCacheExpired: Function,
    onQueryApi: Function,
    minorServerVersion: number,
) {
    setLogLevel();

    const userSettings = await onQueryApi({
        resource: 'userSettings',
    });
    const currentUser = await onQueryApi({
        resource: 'me',
        params: {
            fields: 'id,userRoles',
        },
    });
    rulesEngine.setSelectedUserRoles(currentUser.userRoles.map(({ id }) => id));

    const systemSettings = await onQueryApi({
        resource: 'system/info',
        params: {
            fields: 'dateFormat,serverTimeZoneId',
        },
    });

    // initialize storage controllers
    try {
        await initControllersAsync(onCacheExpired, currentUser);
    } catch (error) {
        throw new DisplayException(i18n.t(
            'A possible reason for this is that the browser or mode (e.g. privacy mode) is not supported. See log for details.',
        ), error);
    }

    // set locale data
    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    await setLocaleDataAsync(uiLocale);

    // initialize system settings
    await initializeSystemSettingsAsync(uiLocale, systemSettings);

    // initialize metadata
    await initializeMetaDataAsync(dbLocale, onQueryApi, minorServerVersion);
}
