// @flow
import { Temporal } from '@js-temporal/polyfill';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a date string into a Temporal.PlainDate object using the system set calendar
 * @export
 * @param {*} string - dateString
 * @returns {(Temporal.PlainDate | null)}
 */

type PlainDate = {
    year: number,
    month: number,
    day: number
};

export function convertStringToTemporal(dateString: ?string): PlainDate | null {
    if (!dateString) {
        return null;
    }
    try {
        const dateWithHyphen = dateString.replace(/[\/\.]/g, '-');

        const calendar = systemSettingsStore.get().calendar;
        const dateFormat = systemSettingsStore.get().dateFormat;

        let year; let month; let day;

        if (dateFormat === 'YYYY-MM-DD') {
            [year, month, day] = dateWithHyphen.split('-').map(Number);
        }
        if (dateFormat === 'DD-MM-YYYY') {
            [day, month, year] = dateWithHyphen.split('-').map(Number);
        }
        return Temporal.PlainDate.from({
            year,
            month,
            day,
            calendar,
        });
    } catch (error) {
        return null;
    }
}
