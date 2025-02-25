// @flow

/**
 * A mapping of DHIS2 calendar system names to Temporal API calendar names.
 *
 * @typedef {string} SupportedCalendar - Temporal-compatible calendar identifier
 */
export const mapDhis2CalendarToTemporal = {
    ethiopian: 'ethiopic',
    coptic: 'coptic',
    gregorian: 'gregory',
    islamic: 'islamic',
    iso8601: 'iso8601',
    nepali: 'nepali',
    thai: 'buddhist',
    persian: 'persian',
};
