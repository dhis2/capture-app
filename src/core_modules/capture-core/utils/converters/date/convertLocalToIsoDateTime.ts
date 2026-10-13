import { convertToIso8601 } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { padWithZeros, formatMomentEn } from 'capture-core-utils/date';
import { parseTime } from 'capture-core-utils/parsers';

type DateTimeValue = {
    date?: string | null;
    time?: string | null;
};

/**
 * Converts a local calendar date and time to an ISO datetime string without timezone (YYYY-MM-DDTHH:mm:ss)
 * @export
 * @param {DateTimeValue} value - date in local calendar format and time
 * @returns {string | null}
 */

export function convertLocalToIsoDateTime({ date, time }: DateTimeValue): string | null {
    if (!date || !time) {
        return null;
    }

    const parsedTime = parseTime(time);
    if (!parsedTime.isValid) {
        return null;
    }

    try {
        const calendar = systemSettingsStore.get().calendar;
        const { year, month, day } = convertToIso8601(date, calendar as any);
        const isoDate = `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}`;
        return `${isoDate}T${formatMomentEn(parsedTime.momentTime, 'HH:mm')}:00`;
    } catch {
        return null;
    }
}
