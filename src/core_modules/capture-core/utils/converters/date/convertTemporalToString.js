// @flow
import { Temporal } from '@js-temporal/polyfill';
import { padWithZeros } from './padWithZeros';
import { systemSettingsStore } from '../../../../capture-core/metaDataMemoryStores';

/**
 * Converts a Temporal.PlainDate to a formatted date string (YYYY-MM-DD || DD-MM-YYYY)
 * @param {Temporal.PlainDate} temporalDate - The Temporal date to convert
 * @returns {string} Formatted date string, or empty string if invalid
 */

export function convertTemporalToString(temporalDate: Temporal.PlainDate | null): string {
    if (!temporalDate) {
        return '';
    }
    const dateFormat = systemSettingsStore.get().dateFormat;

    try {
        const year = temporalDate.year;
        const month = temporalDate.month;
        const day = temporalDate.day;

        return dateFormat === 'YYYY-MM-DD' ?
            `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}` :
            `${padWithZeros(day, 2)}-${padWithZeros(month, 2)}-${padWithZeros(year, 4)}`;
    } catch (error) {
        return '';
    }
}
