// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import environments from 'capture-core/constants/environments';
import moment from 'capture-core/utils/moment/momentResolver';
import CurrentLocaleData from 'capture-core/utils/localeData/CurrentLocaleData';
import { setD2 } from 'capture-core/d2/d2Instance';

// LANGUAGE FILES
import 'moment/locale/nb';
import dateFnNorwegianLocale from 'date-fns/locale/nb';
// END LANGUAGE FILES

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

function configI18n(keyUiLocale: string) {
    const locale = keyUiLocale || 'en';
    config.i18n.sources.add(`i18n/module/i18n_module_${locale}.properties`);
    return keyUiLocale;
}
// TODO: Using norwegian for now
function setLocaleData(uiLocale: string) { //eslint-disable-line
    moment.locale('nb');
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();

    // $FlowSuppress
    const firstDayOfWeek = moment.localeData()._week.dow; //eslint-disable-line

    const localeData: LocaleDataType = {
        dateFnsLocale: dateFnNorwegianLocale,
        weekDays: weekdays,
        weekDaysShort: weekdaysShort,
        calendarFormatHeaderLong: 'dddd D MMM',
        calendarFormatHeaderShort: 'D MMM',
        selectDatesText: 'Velg en eller flere datoer...',
        selectDateText: 'Velg en dato...',
        todayLabelShort: 'I dag',
        todayLabelLong: 'I dag',
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
    configI18n(userSettings.keyUiLocale);
    const d2 = await init();
    setD2(d2);
    // const systemSettings = await getSystemSettings(d2);

    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    setLocaleData(uiLocale);
    await initializeMetaData(dbLocale);
}

