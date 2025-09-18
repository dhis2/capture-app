import log from 'loglevel';
import { environments } from 'capture-core/constants/environments';
import moment from 'moment';
import { CurrentLocaleData } from 'capture-core/utils/localeData/CurrentLocaleData';
import type { LocaleDataType } from 'capture-core/utils/localeData/CurrentLocaleData';
import i18n from '@dhis2/d2-i18n';
import { loadMetaData, cacheSystemSettings } from 'capture-core/metaDataStoreLoaders';
import { buildMetaDataAsync, buildSystemSettingsAsync } from 'capture-core/metaDataMemoryStoreBuilders';
import { initStorageControllers } from 'capture-core/storageControllers';
import { DisplayException } from 'capture-core/utils/exceptions';
import { initRulesEngine } from '../../core_modules/capture-core/rules/rulesEngine';

function setLogLevel() {
    const levels = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };

    let level = levels[process.env.NODE_ENV as keyof typeof levels];
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

    return new Promise<void>((resolve) => {
        import(`moment/locale/${locale}`)
            .then(() => {
                moment.locale(locale);
                log.info(`got moment locale config for ${locale}`);
                resolve();
            })
            .catch(() => {
                moment.locale('en');
                log.error(`could not get moment locale config for ${locale}`);
                resolve();
            });
    });
}

function setDateFnLocaleAsync(locale: string, weekdays: any, weekdaysShort: any, firstDayOfWeek: number) {
    return new Promise<void>((resolve, reject) => {
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

                import('date-fns/locale/en')
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
                        reject(new Error(`could not get the fallback date-fns locale for ${locale}`));
                    });
            });
    });
}

function changeI18nLocale(locale: string) {
    (i18n as any).changeLanguage(locale);
}

function initI18n(locale: string) {
    changeI18nLocale(locale);
    (i18n as any).setDefaultNamespace('default');
}

async function setLocaleDataAsync(uiLocale: string) {
    const locale = uiLocale;
    await setMomentLocaleAsync(locale);
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();

    const firstDayOfWeek = (moment.localeData() as any).week.dow;

    await setDateFnLocaleAsync(locale, weekdays, weekdaysShort, firstDayOfWeek);
    initI18n(locale);
}

async function initializeMetaDataAsync(dbLocale: string, onQueryApi: any, minorServerVersion: number) {
    await loadMetaData(onQueryApi);
    await buildMetaDataAsync(dbLocale, minorServerVersion);
}

async function initializeSystemSettingsAsync(
    systemSettings: { dateFormat: string, serverTimeZoneId: string, calendar: string, baseUrl: string },
    userSettings: { uiLocale: string, captureScope: Array<{ id: string }>, searchScope: Array<{id: string}> },
) {
    const systemSettingsCacheData = await cacheSystemSettings(systemSettings, userSettings);
    await buildSystemSettingsAsync(systemSettingsCacheData);
}

export async function initializeAsync({
    onCacheExpired,
    querySingleResource,
    serverVersion,
    baseUrl,
}: {
    onCacheExpired: () => void,
    querySingleResource: any,
    serverVersion: any,
    baseUrl: string,
}) {
    setLogLevel();

    const {
        id: currentUserId,
        userRoles,
        organisationUnits: captureScope,
        teiSearchOrganisationUnits: searchScope,
        settings: userSettings,
    } = await querySingleResource({
        resource: 'me',
        params: {
            fields: 'id,userRoles,organisationUnits,teiSearchOrganisationUnits,settings',
        },
    });

    const systemSettings = await querySingleResource({
        resource: 'system/info',
        params: {
            fields: 'dateFormat,serverTimeZoneId,calendar',
        },
    });

    let ruleEngineSettings;
    try {
        ruleEngineSettings = await querySingleResource({
            resource: 'dataStore/capture/ruleEngine',
        });
    } catch {
        ruleEngineSettings = { version: 'default' };
    }
    initRulesEngine(ruleEngineSettings.version, userRoles);

    try {
        await initStorageControllers({
            onCacheExpired,
            currentUserId,
            serverVersion,
            baseUrl,
        });
    } catch (error) {
        throw new DisplayException(i18n.t(
            'A possible reason for this is that the browser or mode (e.g. privacy mode) is not supported. ' +
            'See log for details.',
        ), error);
    }

    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    await setLocaleDataAsync(uiLocale);
    await initializeSystemSettingsAsync({ ...systemSettings, baseUrl }, { uiLocale, captureScope, searchScope });

    await initializeMetaDataAsync(dbLocale, querySingleResource, serverVersion.minor);
}
