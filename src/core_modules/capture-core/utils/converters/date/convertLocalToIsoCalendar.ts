import moment from 'moment';
import {
    convertToIso8601,
    formatCalendarDate,
} from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';

/**
 * Converts a date from local calendar to ISO calendar
 * @export
 * @param {string} localDate - date in local calendar format
 * @returns {string}
 */
export function convertLocalToIsoCalendar(localDate: string | null | undefined): string {
    if (!localDate) {
        return '';
    }

    const calendar = systemSettingsStore.get().calendar;

    const dateString = formatCalendarDate(convertToIso8601(localDate, calendar as any));
    const parsedMoment = moment(dateString);

    return parsedMoment.isValid() ? parsedMoment.toISOString() : '';
}
