// @flow
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { padWithZeros } from './padWithZeros';

/**
 * Converts a Temporal.PlainDate to a formatted date string (YYYY-MM-DD or DD-MM-YYYY)
 * @param {Temporal.PlainDate | null} temporalDate - The Temporal date to convert
 * @param {?string} dateFormat - The current system date format ('YYYY-MM-DD' or 'DD-MM-YYYY')
 * @returns {string} Formatted date string, or empty string if invalid
 */

type PlainDate = {
    year: number,
    month: number,
    day: number,
    eraYear: number
};

export function temporalToString(temporalDate: PlainDate | null, dateFormat: ?string): string {
    if (!temporalDate) {
        return '';
    }

    try {
        const calendar = systemSettingsStore.get().calendar;
        const year = calendar === 'ethiopian' ? temporalDate.eraYear : temporalDate.year;
        const month = temporalDate.month;
        const day = temporalDate.day;

        return dateFormat === 'YYYY-MM-DD' ?
            `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}` :
            `${padWithZeros(day, 2)}-${padWithZeros(month, 2)}-${padWithZeros(year, 4)}`;
    } catch (error) {
        return '';
    }
}
