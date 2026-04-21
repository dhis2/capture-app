import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';

/**
 * Converts a date instance to a string based on the system date format
 * @export
 * @param {Date} dateValue: the date instance
 * @returns {string}
 */
export function convertDateObjectToDateFormatString(dateValue: Date | any) {
    const dateString = formatMomentEn(dateValue, 'YYYY-MM-DD');
    return convertIsoToLocalCalendar(dateString);
}
