const supportedTemporalCalendars = ['coptic', 'gregory', 'ethiopic', 'islamic', 'persian', 'islamic-umalqura', 'islamic-tbla',
    'islamic-civil', 'islamic-rgsa', 'hebrew', 'chinese', 'indian', 'buddhist', 'japanese', 'roc', 'dangi'];

/**
 * Checks if a calendar is supported by Temporal.
 *
 * @param {string} calendar - The calendar to check in temporal names (e.g., 'islamic')
 * @returns {boolean} - True if the calendar is supported, false otherwise.
 */
export const isCalendarSupported = calendar => supportedTemporalCalendars.includes(calendar);
