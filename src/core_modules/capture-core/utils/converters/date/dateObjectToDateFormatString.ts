import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';

/**
 * Converts a date instance to a string based on the system date format
 * @export
 * @param {Date} dateValue: the date instance
 * @returns {string}
 */
export function convertDateObjectToDateFormatString(dateValue: Date | any) {
    const momentDate = moment(dateValue);
    const dateString = formatMomentEn(momentDate, 'YYYY-MM-DD');
    return convertIsoToLocalCalendar(dateString);
}
