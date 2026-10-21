import moment from 'moment';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { formatMomentEn, padWithZeros } from 'capture-core-utils/date';

export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

const timeZoneRegex = /(Z|[+-]\d{2}:?\d{2})$/i;

export const hasTimeZone = (value: string) => timeZoneRegex.test(value);

/**
 * Parses a DATETIME value to a timezone-free datetime string (YYYY-MM-DDTHH:mm:ss.SSS), or null if invalid
 * Values without a timezone are kept as entered.
 * @export
 * @param {*} value - datetime string
 * @returns {string | null}
 */
export function parseDateTime(value: any): string | null {
    if (!value) {
        return null;
    }

    if (typeof value === 'string' && !hasTimeZone(value)) {
        // moment.utc is used as a timezone-free calendar, so no daylight saving adjustments are made
        const momentDateTime = moment.utc(value);
        return momentDateTime.isValid() ? formatMomentEn(momentDateTime, DATE_TIME_FORMAT) : null;
    }

    // Legacy values saved in UTC (Z) are converted to the server time zone and the timezone info is removed.
    // This is a best guess of the entered value, and is correct when server and client time zones were the same.
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    // sv-SE formats as YYYY-MM-DD HH:mm:ss
    const serverDateTime = date.toLocaleString('sv-SE', { timeZone: systemSettingsStore.get().serverTimeZoneId });
    return `${serverDateTime.replace(' ', 'T')}.${padWithZeros(date.getUTCMilliseconds(), 3)}`;
}
