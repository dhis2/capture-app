import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';
import { convertToTimeZoneFreeDateTime } from './convertToTimeZoneFreeDateTime';

/**
 * Converts a datetime value to a display string (local calendar date and HH:mm)
 * Values with a timezone (e.g. updatedAt) are shown in the browser time zone.
 * @export
 * @param {string} value - datetime string
 * @returns {string}
 */
export function convertDateTimeForDisplay(value: string): string {
    const dateTime = convertToTimeZoneFreeDateTime(value);
    if (!dateTime) {
        return '';
    }

    const momentDateTime = moment.utc(dateTime);
    const localDate = convertIsoToLocalCalendar(formatMomentEn(momentDateTime, 'YYYY-MM-DD'));
    return `${localDate} ${formatMomentEn(momentDateTime, 'HH:mm')}`;
}
