import moment from 'moment';
import {
    convertFromIso8601,
    formatCalendarDate,
} from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { formatMomentEn } from 'capture-core-utils/date';

/**
 * Converts a date from ISO calendar to local calendar
 * @export
 * @param {string} isoDate - date in ISO format
 * @returns {string}
 */

export function convertIsoToLocalCalendar(isoDate: string | null | undefined): string {
    if (!isoDate) {
        return '';
    }

    const momentDate = moment(isoDate);
    if (!momentDate.isValid()) {
        return '';
    }

    const formattedIsoDate = formatMomentEn(momentDate, 'YYYY-MM-DD');

    const calendar = systemSettingsStore.get().calendar;
    const dateFormat = systemSettingsStore.get().dateFormat;

    const localDate = convertFromIso8601(formattedIsoDate, calendar as any);

    return formatCalendarDate(localDate, { format: dateFormat === 'DD-MM-YYYY' ? 'DD-MM-YYYY' : 'YYYY-MM-DD' });
}
