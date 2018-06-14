// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import environments from 'capture-core/constants/environments';
import moment from 'capture-core/utils/moment/momentResolver';
import CurrentLocaleData from 'capture-core/utils/localeData/CurrentLocaleData';
import { setD2 } from 'capture-core/d2/d2Instance';
import i18n from '@dhis2/d2-i18n';
import { formatterOptions } from 'capture-core/utils/string/format.const';

import loadMetaData from 'capture-core/metaDataStoreLoaders/baseLoader/metaDataLoader';
import buildMetaData from 'capture-core/metaDataMemoryStoreBuilders/baseBuilder/metaDataBuilder';

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

async function initializeManifest() {
    const manifest = await getManifest('manifest.webapp');
    const baseUrl = manifest.getBaseUrl();
    config.baseUrl = `${baseUrl}/api`;
    log.info(`Loading: ${manifest.name} v${manifest.version}`);
}

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur']
    const prefixed = langs.map(c => `${c}-`)
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0
}

function changeLocale(locale) {
    moment.locale(locale)
    i18n.changeLanguage(locale)
    document.body.setAttribute('dir', isLangRTL(locale) ? 'rtl' : 'ltr')
}

function setLocaleData(uiLocale: string) { //eslint-disable-line
    // this should be the user locale
    const locale = 'en';

    changeLocale(locale);

    let dateFnLocale;
    try {
        // this should be replaced with a dynamic import
        dateFnLocale = require(`date-fns/locale/${locale}`);
    } catch (error) {
        log.error(`could not get date-fns locale for ${locale}`);
        dateFnLocale = require('date-fns/locale/en');
    }
    
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();
    // $FlowSuppress
    const firstDayOfWeek = moment.localeData()._week.dow; //eslint-disable-line
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
}

/*
async function getSystemSettings(d2: D2) {
    const systemSettings = await d2.system.settings.all();
    return systemSettings;
}
*/

async function initializeMetaData(dbLocale: string) {
    await loadMetaData();
    await buildMetaData(dbLocale);
}

export async function initialize() {
    setLogLevel();

    await initializeManifest();
    const userSettings = await getUserSettings();
    const d2 = await init();
    setD2(d2);
    // const systemSettings = await getSystemSettings(d2);

    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    setLocaleData(uiLocale);
    await initializeMetaData(dbLocale);
}
