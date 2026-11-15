import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';
import { convertToTimeZoneFreeDateTime } from './convertToTimeZoneFreeDateTime';

/**
 * Converts a datetime value to a display string (local calendar date and HH:mm)
 * Legacy values with a timezone (Z) are shown in the server time zone.
 * @export
 * @param {string} value - datetime string
 * @returns {string}
 */
export function convertDateTimeForDisplay(value: string): string {
    const dateTime = convertToTimeZoneFreeDateTime(value);
    if (!dateTime) {
        return '';
    }

    const timeString = formatMomentEn(moment.utc(dateTime), 'HH:mm');
    const localDate = convertIsoToLocalCalendar(dateTime);
    return `${localDate} ${timeString}`;
}
