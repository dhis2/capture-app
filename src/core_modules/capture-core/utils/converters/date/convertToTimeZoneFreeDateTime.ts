import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';

const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
const timeZoneRegex = /(Z|[+-]\d{2}:?\d{2})$/i;

const isTimeZoneFree = (value: unknown) => typeof value === 'string' && !timeZoneRegex.test(value);

/**
 * Converts a DATETIME value to a timezone-free datetime string (YYYY-MM-DDTHH:mm:ss.SSS), or null if invalid
 * Values without a timezone are kept as entered. Legacy values with a timezone (Z) are converted to the browser time zone.
 * @export
 * @param {*} value - datetime string
 * @returns {string | null}
 */
export function convertToTimeZoneFreeDateTime(value: any): string | null {
    if (!value) {
        return null;
    }

    // moment.utc avoids daylight saving adjustments
    const momentDateTime = isTimeZoneFree(value) ? moment.utc(value) : moment(value);
    return momentDateTime.isValid() ? formatMomentEn(momentDateTime, dateTimeFormat) : null;
}
