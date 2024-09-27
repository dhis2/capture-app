// @flow
import moment from 'moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a string date to a string date with default format based on the system date format
 * @export
 * @param {*} string - the string instance
 * @returns {string}
 */
export function convertStringToDateFormat(date: string) {
    if (!date || !date.length) { return ''; }
    const dateFormat = systemSettingsStore.get().dateFormat;
    const formattedDateString = moment(date, dateFormat).format('YYYY-MM-DD');
    return formattedDateString;
}
