// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings } from 'd2/lib/d2';
import environments from 'capture-core/constants/environments';
// import moment from 'capture-core/utils/moment/momentResolver';
import moment from 'moment';
import CurrentLocaleData from 'capture-core/utils/localeData/CurrentLocaleData';
import { setD2 } from 'capture-core/d2/d2Instance';
import i18n from '@dhis2/d2-i18n';

import { loadMetaData } from 'capture-core/metaDataStoreLoaders';
import { buildMetaData } from 'capture-core/metaDataMemoryStoreBuilders';
import { initControllersAsync } from 'capture-core/storageControllers';

import type { LocaleDataType } from 'capture-core/utils/localeData/CurrentLocaleData';

function setLogLevel() {
    const levels = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };
    // $FlowSuppress
    let level = levels[process.env.NODE_ENV];
    if (!level && level !== 0) {
        level = log.levels.ERROR;
    }

    log.setLevel(level);
}

function setConfig() {
    const { REACT_APP_DHIS2_BASE_URL, REACT_APP_DHIS2_AUTHORIZATION, NODE_ENV } = process.env;
    const baseUrl = REACT_APP_DHIS2_BASE_URL || '';
    config.baseUrl = `${baseUrl}/api`;

    if (NODE_ENV !== environments.prod) {
        config.headers = {
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: REACT_APP_DHIS2_AUTHORIZATION,
        };
    }
}

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
}

function setMomentLocaleAsync(locale: string) {
    if (locale === 'en') {
        moment.locale(locale);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        // $FlowSuppress
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
        // $FlowSuppress
        import(`date-fns/locale/${locale}`)
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
                // $FlowSuppress
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
                        reject();
                    });
            });
    });
}

function changeI18nLocale(locale) {
    i18n.changeLanguage(locale);
    // $FlowSuppress
    document.body.setAttribute('dir', isLangRTL(locale) ? 'rtl' : 'ltr');
}

async function setLocaleData(uiLocale: string) { //eslint-disable-line
    const locale = uiLocale;
    await setMomentLocaleAsync(locale);
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();
    // $FlowSuppress
    const firstDayOfWeek = moment.localeData()._week.dow; //eslint-disable-line

    await setDateFnLocaleAsync(locale, weekdays, weekdaysShort, firstDayOfWeek);
    changeI18nLocale(locale);
}

async function initializeMetaData(dbLocale: string) {
    await loadMetaData();
    await buildMetaData(dbLocale);
}

export async function initializeAsync() {
    setLogLevel();

    // initialize d2
    setConfig();
    const d2 = await init();
    const userSettings = await getUserSettings();
    setD2(d2);
    // initialize storage controllers
    await initControllersAsync();

    // set locale data
    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    await setLocaleData(uiLocale);

    // initialize metadata
    await initializeMetaData(dbLocale);
}
