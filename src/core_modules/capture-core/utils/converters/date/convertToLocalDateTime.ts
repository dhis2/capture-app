import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';

const timeZoneRegex = /(Z|[+-]\d{2}:?\d{2})$/i;

/**
 * Converts a datetime value to a timezone-free local datetime string (YYYY-MM-DDTHH:mm)
 * Values without a timezone are kept as entered. Values with a timezone are converted to the local timezone.
 * @export
 * @param {*} value - datetime string or Date
 * @returns {string | null}
 */
export function convertToLocalDateTime(value: any): string | null {
    if (!value) {
        return null;
    }

    if (typeof value === 'string' && !timeZoneRegex.test(value)) {
        // moment.utc only validates the value; it has no daylight saving gaps
        return moment.utc(value).isValid() ? value.replace(' ', 'T').slice(0, 16) : null;
    }

    const momentDateTime = moment(value);
    return momentDateTime.isValid() ? formatMomentEn(momentDateTime, 'YYYY-MM-DDTHH:mm') : null;
}
