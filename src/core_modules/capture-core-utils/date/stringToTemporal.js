// @flow
import { Temporal } from '@js-temporal/polyfill';

/**
 * Converts a date string into a Temporal.PlainDate object using the specified calendar
 * @export
 * @param {?string} dateString - The date string to convert
 * @param {?string} calendarType - The calendar type to use
 * @param {?string} dateFormat - The current system date format ('YYYY-MM-DD' or 'DD-MM-YYYY')
 * @returns {(Temporal.PlainDate | null)}
 */

type PlainDateType = {
    year: number,
    month: number,
    day: number,
    eraYear: number,
    with: (fields: { year?: number }) => PlainDateType,
    since: (other: PlainDateType, options: { largestUnit: string, smallestUnit: string }) =>
        { years: number, months: number, days: number }
};

export function stringToTemporal(dateString: ?string,
    calendar: ?string,
    dateFormat: ?string): PlainDateType | null {
    if (!dateString) {
        return null;
    }
    try {
        const dateWithHyphen = dateString.replace(/[\/\.]/g, '-');

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
