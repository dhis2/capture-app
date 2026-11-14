import { convertToIso8601 } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { formatMomentEn, padWithZeros } from 'capture-core-utils/date';
import { parseTime } from 'capture-core-utils/parsers';

/**
 * Converts a local calendar date and a time to a timezone-free ISO datetime string (YYYY-MM-DDTHH:mm:ss.SSS)
 * @export
 * @param {string} localDate - date in local calendar format
 * @param {string} time - time string
 * @returns {string | null}
 */
export function convertLocalToIsoDateTime(localDate: string | null | undefined, time: string): string | null {
    const parsedTime = parseTime(time);
    if (!localDate || !parsedTime.isValid) {
        return null;
    }

    try {
        const calendar = systemSettingsStore.get().calendar;
        const { year, month, day } = convertToIso8601(localDate, calendar as any);
        const isoDate = `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}`;
        return `${isoDate}T${formatMomentEn(parsedTime.momentTime, 'HH:mm:ss.SSS')}`;
    } catch {
        return null;
    }
}
