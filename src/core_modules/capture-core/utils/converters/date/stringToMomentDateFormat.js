// @flow
import moment from 'moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a string date to a string date with default format based on the system date format
 * @export
 * @param {*} string - the string instance
 * @param {string} [format] - optional date format. If not provided, the function uses system date format
 * @returns {string}
 */
export function convertStringToDateFormat(date: ?string, format?: string) {
    if (!date || !date.length) { return ''; }
    const dateFormat = format || systemSettingsStore.get().dateFormat;
    const formattedDateString = moment(date, dateFormat).format(dateFormat);
    return formattedDateString;
}
