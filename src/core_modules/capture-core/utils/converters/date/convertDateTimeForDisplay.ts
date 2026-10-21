import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { hasTimeZone } from 'capture-core-utils/parsers';
import { convertIsoToLocalCalendar } from './convertIsoToLocalCalendar';

/**
 * Converts a datetime value to a display string (local calendar date and HH:mm:ss)
 * Values with a timezone (e.g. updatedAt) are shown in the browser time zone.
 * @export
 * @param {string} value - datetime string
 * @returns {string}
 */
export function convertDateTimeForDisplay(value: string): string {
    const momentDateTime = hasTimeZone(value) ? moment(value) : moment.utc(value);
    const localDate = convertIsoToLocalCalendar(formatMomentEn(momentDateTime, 'YYYY-MM-DD'));
    return `${localDate} ${formatMomentEn(momentDateTime, 'HH:mm:ss')}`;
}
