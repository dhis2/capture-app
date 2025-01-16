// @flow
import { systemSettingsStore } from '../../../../capture-core/metaDataMemoryStores';
import { temporalToString } from '../../../../capture-core-utils/date';

/**
 * Converts a Temporal.PlainDate to a formatted date string (YYYY-MM-DD || DD-MM-YYYY)
 * @param {Temporal.PlainDate} temporalDate - The Temporal date to convert
 * @returns {string} Formatted date string, or empty string if invalid
 */

type PlainDate = {
    year: number,
    month: number,
    day: number,
    eraYear: number
};

export function convertTemporalToString(temporalDate: PlainDate | null, format: ?string): string {
    if (!temporalDate) {
        return '';
    }
    const dateFormat = format || systemSettingsStore.get().dateFormat;
    return temporalToString(temporalDate, dateFormat);
}
