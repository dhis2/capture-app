import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';
import { convertToTimeZoneFreeDateTime } from './convertToTimeZoneFreeDateTime';

/**
 * Converts a datetime value to a display string (local calendar date and HH:mm)
 * Values with a timezone (Z) are handled by convertToTimeZoneFreeDateTime, depending on dateTimeHandling.
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
