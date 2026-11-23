import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { isNewDateTimeHandling } from '../../dateTimeHandling';

const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
const timeZoneRegex = /(Z|[+-]\d{2}:?\d{2})$/i;

const isTimeZoneFree = (value: unknown) => typeof value === 'string' && !timeZoneRegex.test(value);

// TODO: DHIS2-22491 Remove Legacy dateTimeHandling when v44 is the lowest supported version
const parseDateTimeWithTimeZone = (value: any) =>
    (isNewDateTimeHandling() ? moment.parseZone(value) : moment(value));

/**
 * Converts a DATETIME value to a timezone-free datetime string (YYYY-MM-DDTHH:mm:ss.SSS), or null if invalid
 * Values without a timezone are kept as entered. For values with a timezone (Z), the timezone is stripped
 * with New dateTimeHandling, and the value is converted to the browser time zone with Legacy dateTimeHandling.
 * @export
 * @param {*} value - datetime string
 * @returns {string | null}
 */
export function convertToTimeZoneFreeDateTime(value: any): string | null {
    if (!value) {
        return null;
    }

    // moment.utc avoids daylight saving adjustments
    const momentDateTime = isTimeZoneFree(value) ? moment.utc(value) : parseDateTimeWithTimeZone(value);
    return momentDateTime.isValid() ? formatMomentEn(momentDateTime, dateTimeFormat) : null;
}
