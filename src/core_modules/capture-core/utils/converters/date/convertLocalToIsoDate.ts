import { convertToIso8601 } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { padWithZeros } from 'capture-core-utils/date';

/**
 * Converts a date from local calendar to an ISO date string (YYYY-MM-DD)
 * @export
 * @param {string} localDate - date in local calendar format
 * @returns {string | null}
 */
export function convertLocalToIsoDate(localDate: string | null | undefined): string | null {
    if (!localDate) {
        return null;
    }

    try {
        const calendar = systemSettingsStore.get().calendar;
        const { year, month, day } = convertToIso8601(localDate, calendar as any);
        return `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}`;
    } catch {
        return null;
    }
}
