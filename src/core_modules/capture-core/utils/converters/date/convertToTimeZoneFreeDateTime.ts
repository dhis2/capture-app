import moment from 'moment';
import { Temporal } from '@js-temporal/polyfill';
import { formatMomentEn } from 'capture-core-utils/date';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';

const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
const timeZoneRegex = /(Z|[+-]\d{2}:?\d{2})$/i;

const isTimeZoneFree = (value: unknown) => typeof value === 'string' && !timeZoneRegex.test(value);

const getServerTimeZone = () =>
    systemSettingsStore.get()?.serverTimeZoneId ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

const convertToServerTimeZone = (value: any): string | null => {
    const momentDateTime = moment(value);
    if (!momentDateTime.isValid()) {
        return null;
    }

    return Temporal.Instant
        .fromEpochMilliseconds(momentDateTime.valueOf())
        .toZonedDateTimeISO(getServerTimeZone())
        .toPlainDateTime()
        .toString({ fractionalSecondDigits: 3 });
};

/**
 * Converts a DATETIME value to a timezone-free datetime string (YYYY-MM-DDTHH:mm:ss.SSS), or null if invalid
 * Values without a timezone are kept as entered. Legacy values with a timezone (Z) are converted to the server time zone,
 * matching the value the server migration will produce.
 * @export
 * @param {*} value - datetime string
 * @returns {string | null}
 */
export function convertToTimeZoneFreeDateTime(value: any): string | null {
    if (!value) {
        return null;
    }

    if (!isTimeZoneFree(value)) {
        return convertToServerTimeZone(value);
    }

    // moment.utc avoids daylight saving adjustments
    const momentDateTime = moment.utc(value);
    return momentDateTime.isValid() ? formatMomentEn(momentDateTime, dateTimeFormat) : null;
}
