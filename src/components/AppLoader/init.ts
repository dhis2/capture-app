/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { environments } from '../../core_modules/capture-core/constants/environments';
import moment from 'moment';
import { CurrentLocaleData } from '../../core_modules/capture-core/utils/localeData/CurrentLocaleData';
import i18n from '@dhis2/d2-i18n';
import type { LocaleDataType } from '../../core_modules/capture-core/utils/localeData/CurrentLocaleData';

import { loadMetaData, cacheSystemSettings } from '../../core_modules/capture-core/metaDataStoreLoaders';
import { buildMetaDataAsync, buildSystemSettingsAsync } from '../../core_modules/capture-core/metaDataMemoryStoreBuilders';
import { initControllersAsync } from '../../core_modules/capture-core/storageControllers';
import { DisplayException } from '../../core_modules/capture-core/utils/exceptions';
import { initRulesEngine } from '../../core_modules/capture-core/rules/rulesEngine';

type SystemSettings = {
    dateFormat: string;
    serverTimeZoneId: string;
    calendar: string;
};

type UserSettings = {
    uiLocale: string;
    captureScope: Array<{ id: string }>;
    searchScope: Array<{ id: string }>;
};

type QueryApiFunction = (params: { resource: string; params?: Record<string, unknown> }) => Promise<unknown>;

function setLogLevel(): void {
    const levels: Record<string, number> = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };

    let level = levels[process.env.NODE_ENV ?? ''];
    if (!level && level !== 0) {
        level = log.levels.ERROR;
    }

    log.setLevel(level);
}

function setMomentLocaleAsync(locale: string): Promise<void> {
    if (locale === 'en') {
        moment.locale(locale);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
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

function setDateFnLocaleAsync(
    locale: string,
    weekdays: string[],
    weekdaysShort: string[],
    firstDayOfWeek: number
): Promise<void> {
    return new Promise((resolve, reject) => {
        import(`date-fns/locale/${locale}/index.js`)
            .then((dateFnLocale) => {
                const localeData: LocaleDataType = {
                    dateFnsLocale,
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
            })
            .catch(() => {
                log.error(`could not get date-fns locale config for ${locale}, fallback to en`);

                import('date-fns/locale/en/index.js')
                    .then((dateFnLocale) => {
                        const localeData: LocaleDataType = {
                            dateFnsLocale,
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

function changeI18nLocale(locale: string): void {
    i18n.changeLanguage(locale);
}

function initI18n(locale: string): void {
    changeI18nLocale(locale);
    i18n.setDefaultNamespace('default');
}

async function setLocaleDataAsync(uiLocale: string): Promise<void> {
    const locale = uiLocale;
    await setMomentLocaleAsync(locale);
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();

    const firstDayOfWeek = (moment.localeData() as any)._week.dow;

    await setDateFnLocaleAsync(locale, weekdays, weekdaysShort, firstDayOfWeek);
    initI18n(locale);
}

async function initializeMetaDataAsync(
    dbLocale: string,
    onQueryApi: QueryApiFunction,
    minorServerVersion: number
): Promise<void> {
    await loadMetaData(onQueryApi);
    await buildMetaDataAsync(dbLocale, minorServerVersion);
}

async function initializeSystemSettingsAsync(
    systemSettings: SystemSettings,
    userSettings: UserSettings
): Promise<void> {
    const systemSettingsCacheData = await cacheSystemSettings(systemSettings, userSettings);
    await buildSystemSettingsAsync(systemSettingsCacheData);
}

export async function initializeAsync(
    onCacheExpired: () => void,
    onQueryApi: QueryApiFunction,
    minorServerVersion: number
): Promise<void> {
    setLogLevel();

    const {
        id: currentUserId,
        userRoles,
        organisationUnits: captureScope,
        teiSearchOrganisationUnits: searchScope,
        settings: userSettings,
    } = await onQueryApi({
        resource: 'me',
        params: {
            fields: 'id,userRoles,organisationUnits,teiSearchOrganisationUnits,settings',
        },
    }) as any;

    const systemSettings = await onQueryApi({
        resource: 'system/info',
        params: {
            fields: 'dateFormat,serverTimeZoneId,calendar',
        },
    }) as SystemSettings;

    let ruleEngineSettings: { version: string };
    try {
        ruleEngineSettings = await onQueryApi({
            resource: 'dataStore/capture/ruleEngine',
        }) as { version: string };
    } catch {
        ruleEngineSettings = { version: 'default' };
    }
    initRulesEngine(ruleEngineSettings.version, userRoles as string[]);

    try {
        await initControllersAsync(onCacheExpired, currentUserId as string);
    } catch (error) {
        throw new DisplayException(i18n.t(
            'A possible reason for this is that the browser or mode (e.g. privacy mode) is not supported. See log for details.',
        ), error as Error);
    }

    const uiLocale = (userSettings as any).keyUiLocale;
    const dbLocale = (userSettings as any).keyDbLocale;
    await setLocaleDataAsync(uiLocale);
    await initializeSystemSettingsAsync(systemSettings, { uiLocale, captureScope, searchScope });

    await initializeMetaDataAsync(dbLocale, onQueryApi, minorServerVersion);
}
