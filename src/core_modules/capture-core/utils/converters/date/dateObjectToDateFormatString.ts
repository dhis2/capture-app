import moment from 'moment';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';

/**
 * Converts a date instance to a string based on the system date format
 * @export
 * @param {Date} dateValue: the date instance
 * @returns {string}
 */
export function convertDateObjectToDateFormatString(dateValue: Date | any) {
    const momentDate = moment(dateValue);
    const dateString = momentDate.format('YYYY-MM-DD');
    return convertIsoToLocalCalendar(dateString);
}
