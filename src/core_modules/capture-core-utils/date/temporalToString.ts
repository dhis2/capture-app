import { formatCalendarDate } from '@dhis2/multi-calendar-dates';

/**
 * Converts a Temporal.PlainDate to a formatted date string (YYYY-MM-DD or DD-MM-YYYY)
 * @param {Temporal.PlainDate | null} temporalDate - The Temporal date to convert
 * @param {?string} dateFormat - The current system date format ('YYYY-MM-DD' or 'DD-MM-YYYY')
 * @returns {string} Formatted date string, or empty string if invalid
 */

type PlainDate = {
    year: number;
    month: number;
    day: number;
    eraYear?: number;
};

export function temporalToString(temporalDate: PlainDate | null, dateFormat: string | null): string {
    if (!temporalDate) {
        return '';
    }

    try {
        return formatCalendarDate(temporalDate, { format: dateFormat as 'YYYY-MM-DD' | 'DD-MM-YYYY' });
    } catch (error) {
        return '';
    }
}
