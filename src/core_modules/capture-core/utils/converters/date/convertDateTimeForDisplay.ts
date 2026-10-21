import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';
import { DATE_TIME_FORMAT, hasTimeZone } from './parseDateTime';

/**
 * Converts a datetime value to a display string (local calendar date and HH:mm)
 * Values with a timezone (timestamps like updatedAt) are shown in the browser time zone.
 * @export
 * @param {string} value - datetime string
 * @returns {string}
 */
export function convertDateTimeForDisplay(value: string): string {
    const dateTime = hasTimeZone(value) ? formatMomentEn(value, DATE_TIME_FORMAT) : value;
    const [date, time = ''] = dateTime.split('T');
    return `${convertIsoToLocalCalendar(date)} ${time.slice(0, 5)}`;
}
