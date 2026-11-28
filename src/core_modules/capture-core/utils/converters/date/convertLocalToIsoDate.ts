import { convertToIso8601, formatCalendarDate } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';

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
        return formatCalendarDate(convertToIso8601(localDate, calendar as any));
    } catch {
        return null;
    }
}
